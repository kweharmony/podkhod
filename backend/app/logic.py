"""Бизнес-логика: расчёты, не связанные с хранением данных."""

from app import models


def set_volume(weight: float, reps: int) -> float:
    """Объём одного подхода: вес умножить на повторения."""
    return weight * reps


def workout_volume(workout: models.Workout) -> float:
    """Объём тренировки — сумма объёмов всех подходов."""
    total = 0.0
    for workout_exercise in workout.exercises:
        for item in workout_exercise.sets:
            total += set_volume(item.weight, item.reps)
    return round(total, 1)


def one_rep_max(weight: float, reps: int) -> float:
    """Расчётный максимум на один повтор по формуле Эпли."""
    return round(weight * (1 + reps / 30), 1)


def exercise_one_rep_max(workout_exercise: models.WorkoutExercise) -> float | None:
    """Лучший расчётный максимум среди подходов упражнения."""
    if not workout_exercise.sets:
        return None
    return max(one_rep_max(item.weight, item.reps) for item in workout_exercise.sets)


def bmi(weight_kg: float, height_cm: float | None) -> float | None:
    """Индекс массы тела. Без роста посчитать нельзя."""
    if not height_cm:
        return None
    height_m = height_cm / 100
    return round(weight_kg / (height_m**2), 1)
