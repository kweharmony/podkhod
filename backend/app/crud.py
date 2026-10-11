"""Операции с данными. Здесь и только здесь приложение общается с базой."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models, schemas

# ---------- Пользователи ----------


def get_user(db: Session, user_id: int) -> models.User | None:
    return db.get(models.User, user_id)


def get_user_by_email(db: Session, email: str) -> models.User | None:
    return db.scalar(select(models.User).where(models.User.email == email))


def list_users(db: Session) -> list[models.User]:
    return list(db.scalars(select(models.User).order_by(models.User.id)))


def create_user(db: Session, data: schemas.UserCreate) -> models.User:
    user = models.User(**data.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user: models.User, data: schemas.UserUpdate) -> models.User:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user: models.User) -> None:
    db.delete(user)
    db.commit()


# ---------- Упражнения ----------


def get_exercise(db: Session, exercise_id: int) -> models.Exercise | None:
    return db.get(models.Exercise, exercise_id)


def list_exercises(
    db: Session, body_part: str | None = None, equipment: str | None = None
) -> list[models.Exercise]:
    query = select(models.Exercise).order_by(models.Exercise.id)
    if body_part:
        query = query.where(models.Exercise.body_part == body_part)
    if equipment:
        query = query.where(models.Exercise.equipment == equipment)
    return list(db.scalars(query))


def create_exercise(db: Session, data: schemas.ExerciseCreate) -> models.Exercise:
    exercise = models.Exercise(**data.model_dump())
    db.add(exercise)
    db.commit()
    db.refresh(exercise)
    return exercise


def update_exercise(
    db: Session, exercise: models.Exercise, data: schemas.ExerciseUpdate
) -> models.Exercise:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(exercise, field, value)
    db.commit()
    db.refresh(exercise)
    return exercise


def delete_exercise(db: Session, exercise: models.Exercise) -> None:
    db.delete(exercise)
    db.commit()


# ---------- Тренировки ----------


def get_workout(db: Session, workout_id: int) -> models.Workout | None:
    return db.get(models.Workout, workout_id)


def list_workouts(db: Session, user_id: int | None = None) -> list[models.Workout]:
    query = select(models.Workout).order_by(models.Workout.date.desc())
    if user_id:
        query = query.where(models.Workout.user_id == user_id)
    return list(db.scalars(query))


def create_workout(db: Session, data: schemas.WorkoutCreate) -> models.Workout:
    workout = models.Workout(**data.model_dump())
    db.add(workout)
    db.commit()
    db.refresh(workout)
    return workout


def update_workout(
    db: Session, workout: models.Workout, data: schemas.WorkoutUpdate
) -> models.Workout:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(workout, field, value)
    db.commit()
    db.refresh(workout)
    return workout


def delete_workout(db: Session, workout: models.Workout) -> None:
    db.delete(workout)
    db.commit()


# ---------- Упражнения в тренировке ----------


def get_workout_exercise(db: Session, item_id: int) -> models.WorkoutExercise | None:
    return db.get(models.WorkoutExercise, item_id)


def add_exercise_to_workout(
    db: Session, workout: models.Workout, data: schemas.WorkoutExerciseCreate
) -> models.WorkoutExercise:
    item = models.WorkoutExercise(workout_id=workout.id, **data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def delete_workout_exercise(db: Session, item: models.WorkoutExercise) -> None:
    db.delete(item)
    db.commit()


# ---------- Подходы ----------


def get_set(db: Session, set_id: int) -> models.Set | None:
    return db.get(models.Set, set_id)


def create_set(
    db: Session, workout_exercise: models.WorkoutExercise, data: schemas.SetCreate
) -> models.Set:
    item = models.Set(workout_exercise_id=workout_exercise.id, **data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def delete_set(db: Session, item: models.Set) -> None:
    db.delete(item)
    db.commit()


# ---------- Замеры ----------


def get_measurement(db: Session, measurement_id: int) -> models.Measurement | None:
    return db.get(models.Measurement, measurement_id)


def list_measurements(db: Session, user_id: int | None = None) -> list[models.Measurement]:
    query = select(models.Measurement).order_by(models.Measurement.date.desc())
    if user_id:
        query = query.where(models.Measurement.user_id == user_id)
    return list(db.scalars(query))


def create_measurement(db: Session, data: schemas.MeasurementCreate) -> models.Measurement:
    measurement = models.Measurement(**data.model_dump())
    db.add(measurement)
    db.commit()
    db.refresh(measurement)
    return measurement


def update_measurement(
    db: Session, measurement: models.Measurement, data: schemas.MeasurementUpdate
) -> models.Measurement:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(measurement, field, value)
    db.commit()
    db.refresh(measurement)
    return measurement


def delete_measurement(db: Session, measurement: models.Measurement) -> None:
    db.delete(measurement)
    db.commit()
