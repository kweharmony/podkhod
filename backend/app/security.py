from datetime import datetime, timedelta, timezone
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import User

passwords = PasswordHash.recommended()
bearer = HTTPBearer(auto_error=False)


def access_token(user_id: int) -> str:
    return jwt.encode({"sub": str(user_id), "exp": datetime.now(timezone.utc) +
                       timedelta(minutes=settings.access_minutes)},
                      settings.jwt_secret, algorithm="HS256")


def current_user(credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
                 db: Session = Depends(get_db)) -> User:
    try:
        if credentials is None:
            raise ValueError()
        payload = jwt.decode(credentials.credentials, settings.jwt_secret,
                             algorithms=["HS256"], options={"require": ["sub", "exp"]})
        user = db.get(User, int(payload["sub"]))
        if user is None:
            raise ValueError()
        return user
    except (jwt.InvalidTokenError, ValueError, TypeError):
        raise HTTPException(401, "Войдите в аккаунт", headers={"WWW-Authenticate": "Bearer"})


def check_owner(owner_id: int, user: User):
    if owner_id != user.id:
        raise HTTPException(403, "Нет доступа к чужим данным")
