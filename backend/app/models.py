from datetime import date

from sqlalchemy import Date, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    """Пользователь приложения."""

    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    name: Mapped[str] = mapped_column(String(100))
    height_cm: Mapped[float | None] = mapped_column(Float, nullable=True)

    workouts: Mapped[list["Workout"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    measurements: Mapped[list["Measurement"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class Exercise(Base):
    """Упражнение из справочника. Общее для всех пользователей."""

    __tablename__ = "exercise"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    body_part: Mapped[str] = mapped_column(String(50))
    equipment: Mapped[str] = mapped_column(String(50))
    target: Mapped[str] = mapped_column(String(100))
    instruction: Mapped[str | None] = mapped_column(Text, nullable=True)


class Workout(Base):
    """Одна тренировка пользователя."""

    __tablename__ = "workout"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    date: Mapped[date] = mapped_column(Date)
    title: Mapped[str] = mapped_column(String(200))
    note: Mapped[str | None] = mapped_column(Text, nullable=True)

    user: Mapped["User"] = relationship(back_populates="workouts")
    exercises: Mapped[list["WorkoutExercise"]] = relationship(
        back_populates="workout", cascade="all, delete-orphan"
    )


class WorkoutExercise(Base):
    """Упражнение внутри тренировки. Связывает workout и exercise."""

    __tablename__ = "workout_exercise"

    id: Mapped[int] = mapped_column(primary_key=True)
    workout_id: Mapped[int] = mapped_column(ForeignKey("workout.id", ondelete="CASCADE"))
    exercise_id: Mapped[int] = mapped_column(ForeignKey("exercise.id"))
    position: Mapped[int] = mapped_column(Integer, default=1)

    workout: Mapped["Workout"] = relationship(back_populates="exercises")
    exercise: Mapped["Exercise"] = relationship()
    sets: Mapped[list["Set"]] = relationship(
        back_populates="workout_exercise", cascade="all, delete-orphan"
    )


class Set(Base):
    """Один подход: вес и количество повторений."""

    __tablename__ = "set"

    id: Mapped[int] = mapped_column(primary_key=True)
    workout_exercise_id: Mapped[int] = mapped_column(
        ForeignKey("workout_exercise.id", ondelete="CASCADE")
    )
    weight: Mapped[float] = mapped_column(Float)
    reps: Mapped[int] = mapped_column(Integer)

    workout_exercise: Mapped["WorkoutExercise"] = relationship(back_populates="sets")


class Measurement(Base):
    """Замер тела."""

    __tablename__ = "measurement"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    date: Mapped[date] = mapped_column(Date)
    weight: Mapped[float] = mapped_column(Float)
    chest: Mapped[float | None] = mapped_column(Float, nullable=True)
    waist: Mapped[float | None] = mapped_column(Float, nullable=True)

    user: Mapped["User"] = relationship(back_populates="measurements")
