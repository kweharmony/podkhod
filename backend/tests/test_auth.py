"""Проверка ЛР №4 в отдельной схеме PostgreSQL, без изменения данных приложения."""
import unittest
from datetime import datetime, timedelta, timezone
from hashlib import sha256
from uuid import uuid4

import jwt
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import text, select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import Base, engine, get_db
from app.models import User, RefreshToken
from app.routers import auth, users, workouts, measurements, advice, exercises


class AuthTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.schema = "test_auth_" + uuid4().hex
        with engine.begin() as connection:
            connection.execute(text(f'CREATE SCHEMA "{cls.schema}"'))
        cls.test_engine = engine.execution_options(schema_translate_map={None: cls.schema})
        Base.metadata.create_all(cls.test_engine)
        cls.app = FastAPI()
        for router in (auth, users, workouts, measurements, advice, exercises):
            cls.app.include_router(router.router)

        def test_db():
            with Session(cls.test_engine) as db:
                yield db
        cls.app.dependency_overrides[get_db] = test_db

    @classmethod
    def tearDownClass(cls):
        with engine.begin() as connection:
            connection.execute(text(f'DROP SCHEMA "{cls.schema}" CASCADE'))

    def register(self):
        client = TestClient(self.app, base_url="http://testserver")
        data = {"name": "Тест", "email": uuid4().hex + "@example.com", "password": "password123"}
        response = client.post('/auth/register', json=data)
        self.assertEqual(response.status_code, 201, response.text)
        client.headers['Authorization'] = 'Bearer ' + response.json()['access_token']
        return client, data

    def test_registration_login_and_hash(self):
        client, data = self.register()
        response = client.get('/auth/me')
        self.assertEqual(response.status_code, 200)
        self.assertNotIn('password_hash', response.json())
        with Session(self.test_engine) as db:
            user = db.scalar(select(User).where(User.email == data['email']))
            self.assertTrue(user.password_hash.startswith('$argon2'))
            self.assertNotIn(data['password'], user.password_hash)
        self.assertEqual(client.post('/auth/register', json=data).status_code, 409)
        self.assertEqual(client.post('/auth/login', json=data).status_code, 200)
        data['password'] = 'wrongpassword'
        self.assertEqual(client.post('/auth/login', json=data).status_code, 401)
        self.assertEqual(client.post('/auth/register', json={}).status_code, 422)

    def test_refresh_expiry_and_logout(self):
        client, _ = self.register()
        token = client.cookies.get('refresh_token')
        # Cookie имеет путь /api/auth. Для прямого TestClient передаём её явно.
        cookie = {'Cookie': 'refresh_token=' + token}
        self.assertEqual(client.post('/auth/refresh', headers=cookie).status_code, 200)
        self.assertEqual(client.post('/auth/refresh', headers={'Cookie': 'refresh_token=bad'}).status_code, 401)
        other, _ = self.register()
        other_cookie = {'Cookie': 'refresh_token=' + other.cookies.get('refresh_token')}
        self.assertEqual(client.post('/auth/logout', headers=cookie).status_code, 204)
        self.assertEqual(client.post('/auth/refresh', headers=cookie).status_code, 401)
        self.assertEqual(other.post('/auth/refresh', headers=other_cookie).status_code, 200)
        hashed = sha256(other.cookies.get('refresh_token').encode()).hexdigest()
        with Session(self.test_engine) as db:
            session = db.scalar(select(RefreshToken).where(RefreshToken.token_hash == hashed))
            session.expires_at = datetime.now(timezone.utc) - timedelta(seconds=1)
            db.commit()
        self.assertEqual(other.post('/auth/refresh', headers=other_cookie).status_code, 401)

    def test_access_and_ownership(self):
        client, _ = self.register()
        other, _ = self.register()
        user_id = client.get('/auth/me').json()['id']
        other_id = other.get('/auth/me').json()['id']
        anonymous = TestClient(self.app)
        for path in ['/workouts', '/measurements', '/auth/me', f'/users/{user_id}/advice']:
            self.assertEqual(anonymous.get(path).status_code, 401)
        self.assertEqual(anonymous.get('/exercises').status_code, 200)
        for access in ['bad', jwt.encode({'sub': str(user_id), 'exp': datetime.now(timezone.utc) - timedelta(seconds=1)}, settings.jwt_secret, algorithm='HS256')]:
            self.assertEqual(anonymous.get('/auth/me', headers={'Authorization': 'Bearer ' + access}).status_code, 401)
        workout = client.post('/workouts', json={'user_id': user_id, 'date': '2026-11-01', 'title': 'Тест'}).json()
        wid = workout['id']
        self.assertEqual(other.get(f'/workouts/{wid}').status_code, 403)
        self.assertEqual(other.patch(f'/workouts/{wid}', json={'title': 'Чужая'}).status_code, 403)
        self.assertEqual(other.delete(f'/workouts/{wid}').status_code, 403)
        self.assertEqual(other.get('/workouts').json(), [])
        self.assertEqual(client.post('/workouts', json={'user_id': other_id, 'date': '2026-11-01', 'title': 'Тест'}).status_code, 403)
        exercise = client.post('/exercises', json={'name': 'Test', 'body_part': 'Test', 'equipment': 'Test', 'target': 'Test'}).json()
        item = client.post(f'/workouts/{wid}/exercises', json={'exercise_id': exercise['id']}).json()
        iid = item['id']
        self.assertEqual(other.post(f'/workouts/{wid}/exercises', json={'exercise_id': exercise['id']}).status_code, 403)
        self.assertEqual(other.post(f'/workouts/exercises/{iid}/sets', json={'weight': 10, 'reps': 5}).status_code, 403)
        approach = client.post(f'/workouts/exercises/{iid}/sets', json={'weight': 10, 'reps': 5}).json()
        self.assertEqual(other.delete(f"/workouts/sets/{approach['id']}").status_code, 403)
        self.assertEqual(other.delete(f'/workouts/exercises/{iid}').status_code, 403)
        measurement = client.post('/measurements', json={'user_id': user_id, 'date': '2026-11-01', 'weight': 80}).json()
        mid = measurement['id']
        for method in ['get', 'patch', 'delete']:
            options = {'json': {'weight': 90}} if method == 'patch' else {}
            self.assertEqual(getattr(other, method)(f'/measurements/{mid}', **options).status_code, 403)
        self.assertEqual(other.get('/measurements').json(), [])
        self.assertEqual(other.post('/measurements', json={'user_id': user_id, 'date': '2026-11-01', 'weight': 80}).status_code, 403)
        for method in ['get', 'post']:
            self.assertEqual(getattr(other, method)(f'/users/{user_id}/advice').status_code, 403)
        self.assertEqual(other.get(f'/users/{user_id}').status_code, 403)


if __name__ == '__main__':
    unittest.main()

