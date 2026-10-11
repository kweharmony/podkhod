from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, logic, schemas
from app.database import get_db

router = APIRouter(prefix="/workouts", tags=["Тренировки"])


def _get_workout_or_404(db: Session, workout_id: int):
    workout = crud.get_workout(db, workout_id)
    if workout is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Тренировка не найдена")
    return workout


@router.get("", response_model=list[schemas.WorkoutRead])
def read_workouts(user_id: int | None = None, db: Session = Depends(get_db)):
    return crud.list_workouts(db, user_id=user_id)


@router.get("/{workout_id}", response_model=schemas.WorkoutDetail)
def read_workout(workout_id: int, db: Session = Depends(get_db)):
    workout = _get_workout_or_404(db, workout_id)
    exercises = []
    for item in workout.exercises:
        row = schemas.WorkoutExerciseRead.model_validate(item)
        row.one_rep_max = logic.exercise_one_rep_max(item)
        exercises.append(row)
    return schemas.WorkoutDetail(
        id=workout.id,
        user_id=workout.user_id,
        date=workout.date,
        title=workout.title,
        note=workout.note,
        exercises=exercises,
        volume=logic.workout_volume(workout),
    )


@router.post("", response_model=schemas.WorkoutRead, status_code=status.HTTP_201_CREATED)
def add_workout(data: schemas.WorkoutCreate, db: Session = Depends(get_db)):
    if crud.get_user(db, data.user_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Пользователь не найден")
    return crud.create_workout(db, data)


@router.patch("/{workout_id}", response_model=schemas.WorkoutRead)
def edit_workout(
    workout_id: int, data: schemas.WorkoutUpdate, db: Session = Depends(get_db)
):
    workout = _get_workout_or_404(db, workout_id)
    return crud.update_workout(db, workout, data)


@router.delete("/{workout_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_workout(workout_id: int, db: Session = Depends(get_db)):
    workout = _get_workout_or_404(db, workout_id)
    crud.delete_workout(db, workout)


# ---------- Упражнения внутри тренировки ----------


@router.post(
    "/{workout_id}/exercises",
    response_model=schemas.WorkoutExerciseRead,
    status_code=status.HTTP_201_CREATED,
    tags=["Упражнения в тренировке"],
)
def add_exercise_to_workout(
    workout_id: int,
    data: schemas.WorkoutExerciseCreate,
    db: Session = Depends(get_db),
):
    workout = _get_workout_or_404(db, workout_id)
    if crud.get_exercise(db, data.exercise_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Упражнение не найдено")
    return crud.add_exercise_to_workout(db, workout, data)


@router.delete(
    "/exercises/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Упражнения в тренировке"],
)
def remove_exercise_from_workout(item_id: int, db: Session = Depends(get_db)):
    item = crud.get_workout_exercise(db, item_id)
    if item is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Упражнение в тренировке не найдено")
    crud.delete_workout_exercise(db, item)


# ---------- Подходы ----------


@router.post(
    "/exercises/{item_id}/sets",
    response_model=schemas.SetRead,
    status_code=status.HTTP_201_CREATED,
    tags=["Подходы"],
)
def add_set(item_id: int, data: schemas.SetCreate, db: Session = Depends(get_db)):
    item = crud.get_workout_exercise(db, item_id)
    if item is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Упражнение в тренировке не найдено")
    return crud.create_set(db, item, data)


@router.delete(
    "/sets/{set_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Подходы"]
)
def remove_set(set_id: int, db: Session = Depends(get_db)):
    item = crud.get_set(db, set_id)
    if item is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Подход не найден")
    crud.delete_set(db, item)
