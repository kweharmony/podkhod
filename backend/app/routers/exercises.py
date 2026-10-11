from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/exercises", tags=["Упражнения"])


@router.get("", response_model=list[schemas.ExerciseRead])
def read_exercises(
    body_part: str | None = None,
    equipment: str | None = None,
    db: Session = Depends(get_db),
):
    return crud.list_exercises(db, body_part=body_part, equipment=equipment)


@router.get("/{exercise_id}", response_model=schemas.ExerciseRead)
def read_exercise(exercise_id: int, db: Session = Depends(get_db)):
    exercise = crud.get_exercise(db, exercise_id)
    if exercise is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Упражнение не найдено")
    return exercise


@router.post("", response_model=schemas.ExerciseRead, status_code=status.HTTP_201_CREATED)
def add_exercise(data: schemas.ExerciseCreate, db: Session = Depends(get_db)):
    return crud.create_exercise(db, data)


@router.patch("/{exercise_id}", response_model=schemas.ExerciseRead)
def edit_exercise(
    exercise_id: int, data: schemas.ExerciseUpdate, db: Session = Depends(get_db)
):
    exercise = crud.get_exercise(db, exercise_id)
    if exercise is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Упражнение не найдено")
    return crud.update_exercise(db, exercise, data)


@router.delete("/{exercise_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_exercise(exercise_id: int, db: Session = Depends(get_db)):
    exercise = crud.get_exercise(db, exercise_id)
    if exercise is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Упражнение не найдено")
    crud.delete_exercise(db, exercise)
