from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/users", tags=["Пользователи"])


@router.get("", response_model=list[schemas.UserRead])
def read_users(db: Session = Depends(get_db)):
    return crud.list_users(db)


@router.get("/{user_id}", response_model=schemas.UserRead)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Пользователь не найден")
    return user


@router.post("", response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED)
def add_user(data: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, data.email):
        raise HTTPException(
            status.HTTP_409_CONFLICT, "Пользователь с таким email уже существует"
        )
    return crud.create_user(db, data)


@router.patch("/{user_id}", response_model=schemas.UserRead)
def edit_user(user_id: int, data: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Пользователь не найден")
    return crud.update_user(db, user, data)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Пользователь не найден")
    crud.delete_user(db, user)
