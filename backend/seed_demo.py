"""Данные для защиты. Запуск из backend: python seed_demo.py."""
from datetime import date, timedelta
from pathlib import Path
import os

from sqlalchemy import select
from sqlalchemy.orm import Session

# .env читается относительно backend, даже при запуске из другой папки.
os.chdir(Path(__file__).resolve().parent)

from app import logic, models
from app.database import Base, engine, SessionLocal
from app.migrate_auth import add_password_column
from app.security import passwords

EMAIL = "demo@example.com"
PASSWORD = "PodkhodDemo123"
NAME = "Демо для защиты"

EXERCISES = [
    ("Barbell Bench Press", "Грудь", "Штанга", "Большая грудная", 50),
    ("Overhead Press", "Плечи", "Штанга", "Дельтовидная", 25),
    ("Lateral Raise", "Плечи", "Гантели", "Средняя дельта", 6),
    ("Barbell Squat", "Ноги", "Штанга", "Квадрицепс", 60),
    ("Romanian Deadlift", "Ноги", "Штанга", "Бицепс бедра", 50),
    ("Bent Over Row", "Спина", "Штанга", "Широчайшая", 35),
]


def seed(db: Session):
    existing = db.scalar(select(models.User).where(models.User.email == EMAIL))
    if existing:
        if existing.name != NAME or not existing.password_hash or not passwords.verify(PASSWORD, existing.password_hash):
            raise ValueError("Email demo@example.com уже занят другим аккаунтом. Данные не изменены.")
        return False

    today = date.today()
    user = models.User(email=EMAIL, name=NAME, height_cm=180,
                       password_hash=passwords.hash(PASSWORD))
    db.add(user)
    db.flush()

    exercises = []
    for name, body_part, equipment, target, _ in EXERCISES:
        exercise = db.scalar(select(models.Exercise).where(models.Exercise.name == name))
        if exercise is None:
            exercise = models.Exercise(name=name, body_part=body_part,
                                       equipment=equipment, target=target)
            db.add(exercise)
        exercises.append(exercise)

    workouts = []
    # Шесть недель, по две тренировки; веса постепенно растут.
    for week in range(6):
        for day in range(2):
            workout = models.Workout(user_id=user.id,
                date=today - timedelta(days=(5 - week) * 7 + (4 if day == 0 else 1)),
                title="Грудь и плечи" if day == 0 else "Ноги и спина",
                note="Учебные данные для демонстрации")
            db.add(workout)
            workouts.append(workout)
            for position, index in enumerate(range(day * 3, day * 3 + 3), start=1):
                item = models.WorkoutExercise(exercise=exercises[index], position=position)
                workout.exercises.append(item)
                base = EXERCISES[index][4]
                weight = base + week * (1 if base < 10 else 2.5)
                for reps in (10, 9, 8):
                    item.sets.append(models.Set(weight=weight, reps=reps))

    measurements = []
    for week in range(6):
        measurement = models.Measurement(user_id=user.id,
            date=today - timedelta(days=(5 - week) * 7),
            weight=round(82 - week * 0.3, 1), chest=102 + week * 0.2,
            waist=round(87 - week * 0.4, 1))
        db.add(measurement)
        measurements.append(measurement)

    # Совет рассчитывается нашими правилами, запрос к платной модели не нужен.
    facts = logic.collect_facts(sorted(workouts, key=lambda w: w.date, reverse=True),
                                sorted(measurements, key=lambda m: m.date, reverse=True))
    db.add(models.Advice(user_id=user.id, created_at=today,
                        text=" ".join(logic.rule_based_advice(facts)), source="rules"))
    db.commit()
    return True


def main():
    Base.metadata.create_all(engine)
    add_password_column()
    with SessionLocal() as db:
        created = seed(db)
    print("Созданы 12 тренировок, 108 подходов, 6 замеров и совет." if created
          else "Демо-аккаунт уже существует. Повторные данные не добавлены.")
    print(f"Войдите на сайте: {EMAIL} / {PASSWORD}")
    print("Это отдельный учебный аккаунт. Данные других пользователей не изменены.")


if __name__ == "__main__":
    main()
