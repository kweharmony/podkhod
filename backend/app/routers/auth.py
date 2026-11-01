from datetime import datetime, timedelta, timezone
from hashlib import sha256
import secrets

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import RefreshToken, User
from app.schemas import UserRead
from app.security import access_token, current_user, passwords

router = APIRouter(prefix="/auth", tags=["Вход"])


class Login(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class Register(Login):
    name: str = Field(min_length=2, max_length=100)


class Tokens(BaseModel):
    access_token: str
    token_type: str = "bearer"


def start_session(user: User, db: Session, response: Response):
    token = secrets.token_urlsafe(48)
    db.add(RefreshToken(user_id=user.id, token_hash=sha256(token.encode()).hexdigest(),
                       expires_at=datetime.now(timezone.utc) + timedelta(days=settings.refresh_days)))
    db.commit()
    response.set_cookie("refresh_token", token, httponly=True, secure=settings.cookie_secure,
                        samesite="strict", path="/api/auth", max_age=settings.refresh_days * 86400)
    return Tokens(access_token=access_token(user.id))


@router.post("/register", response_model=Tokens, status_code=201)
def register(data: Register, response: Response, db: Session = Depends(get_db)):
    user = User(email=str(data.email).lower(), name=data.name,
                password_hash=passwords.hash(data.password))
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "Этот email уже зарегистрирован")
    db.refresh(user)
    return start_session(user, db, response)


@router.post("/login", response_model=Tokens)
def login(data: Login, response: Response, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == str(data.email).lower()))
    if user is None or not user.password_hash or not passwords.verify(data.password, user.password_hash):
        raise HTTPException(401, "Неверный email или пароль")
    return start_session(user, db, response)


@router.post("/refresh", response_model=Tokens)
def refresh(refresh_token: str | None = Cookie(default=None), db: Session = Depends(get_db)):
    hashed = sha256((refresh_token or "").encode()).hexdigest()
    session = db.scalar(select(RefreshToken).where(RefreshToken.token_hash == hashed))
    if session is None or session.expires_at <= datetime.now(timezone.utc):
        raise HTTPException(401, "Сессия истекла, войдите снова")
    if db.get(User, session.user_id) is None:
        raise HTTPException(401, "Сессия недействительна")
    return Tokens(access_token=access_token(session.user_id))


@router.get("/me", response_model=UserRead)
def me(user: User = Depends(current_user)):
    return user


@router.post("/logout", status_code=204)
def logout(response: Response, refresh_token: str | None = Cookie(default=None),
           db: Session = Depends(get_db)):
    hashed = sha256((refresh_token or "").encode()).hexdigest()
    db.execute(delete(RefreshToken).where(RefreshToken.token_hash == hashed))
    db.commit()
    response.delete_cookie("refresh_token", path="/api/auth")
