from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import assistant, crud, schemas
from app.database import get_db
from app.models import User
from app.security import current_user, check_owner

router = APIRouter(prefix="/users/{user_id}/advice", tags=["Помощник"])


@router.get("", response_model=schemas.AdviceRead)
def read_advice(user_id: int, db: Session = Depends(get_db), user: User = Depends(current_user)):
    """Последний сохранённый совет."""
    check_owner(user_id, user)
    if crud.get_user(db, user_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Пользователь не найден")

    advice = crud.get_last_advice(db, user_id)
    if advice is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Советов пока нет")
    return advice


@router.post("", response_model=schemas.AdviceRead, status_code=status.HTTP_201_CREATED)
def make_advice(user_id: int, db: Session = Depends(get_db), user: User = Depends(current_user)):
    """Собирает данные пользователя и готовит новый совет."""
    check_owner(user_id, user)
    if crud.get_user(db, user_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Пользователь не найден")

    workouts = crud.list_workouts(db, user_id=user_id)
    measurements = crud.list_measurements(db, user_id=user_id)

    text, source = assistant.make_advice(workouts, measurements)
    return crud.create_advice(db, user_id, text, source)
