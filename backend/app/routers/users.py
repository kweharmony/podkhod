from fastapi import APIRouter, Depends
from app.models import User
from app.schemas import UserRead
from app.security import current_user, check_owner

router = APIRouter(prefix="/users", tags=["Пользователи"])


@router.get("/{user_id}", response_model=UserRead)
def read_user(user_id: int, user: User = Depends(current_user)):
    check_owner(user_id, user)
    return user
