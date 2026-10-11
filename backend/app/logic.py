"""Бизнес-логика: расчёты, не связанные с хранением данных."""

from datetime import date, timedelta

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


# ---------- Факты для помощника ----------


def collect_facts(
    workouts: list[models.Workout],
    measurements: list[models.Measurement],
    today: date | None = None,
) -> dict:
    """Собирает цифры, по которым помощник будет давать совет.

    Тренировки и замеры приходят отсортированными от новых к старым.
    """
    today = today or date.today()
    two_weeks_ago = today - timedelta(days=14)
    four_weeks_ago = today - timedelta(days=28)

    recent = [w for w in workouts if w.date > two_weeks_ago]
    previous = [w for w in workouts if four_weeks_ago < w.date <= two_weeks_ago]

    facts = {
        "workouts_two_weeks": len(recent),
        "workouts_previous_two_weeks": len(previous),
        "volume_two_weeks": round(sum(workout_volume(w) for w in recent), 1),
        "volume_previous_two_weeks": round(sum(workout_volume(w) for w in previous), 1),
        "days_since_last_workout": (today - workouts[0].date).days if workouts else None,
        "exercises": exercise_progress(workouts),
    }

    if measurements:
        facts["body_weight"] = measurements[0].weight
        if len(measurements) > 1:
            facts["body_weight_change"] = round(
                measurements[0].weight - measurements[-1].weight, 1
            )
    return facts


def exercise_progress(workouts: list[models.Workout]) -> list[dict]:
    """По каждому упражнению: лучший 1RM сейчас и раньше."""
    history: dict[str, list[float]] = {}
    for workout in workouts:  # от новых к старым
        for item in workout.exercises:
            best = exercise_one_rep_max(item)
            if best is not None:
                history.setdefault(item.exercise.name, []).append(best)

    result = []
    for name, values in history.items():
        result.append(
            {
                "name": name,
                "current_one_rep_max": values[0],
                "best_one_rep_max": max(values),
                "sessions": len(values),
            }
        )
    return result


def rule_based_advice(facts: dict) -> list[str]:
    """Наблюдения по правилам. Используются и в подсказке модели, и как запасной совет."""
    notes = []

    days = facts.get("days_since_last_workout")
    if days is None:
        notes.append("Тренировок пока нет — начните с первой и запишите подходы.")
        return notes
    if days > 7:
        notes.append(f"Последняя тренировка была {days} дней назад — пора вернуться.")

    if facts["workouts_two_weeks"] < facts["workouts_previous_two_weeks"]:
        notes.append("Тренировок за две недели стало меньше, чем было до этого.")

    previous_volume = facts["volume_previous_two_weeks"]
    if previous_volume:
        change = (facts["volume_two_weeks"] - previous_volume) / previous_volume * 100
        if change <= -15:
            notes.append(f"Объём упал на {abs(round(change))}% — стоит добавить подходы.")
        elif change >= 15:
            notes.append(f"Объём вырос на {round(change)}% — следите за восстановлением.")

    for exercise in facts["exercises"]:
        if exercise["sessions"] >= 3 and exercise["current_one_rep_max"] < exercise["best_one_rep_max"]:
            notes.append(
                f"{exercise['name']}: результат ниже лучшего "
                f"({exercise['current_one_rep_max']} против {exercise['best_one_rep_max']} кг)."
            )

    if not notes:
        notes.append("Всё идёт ровно: держите текущий режим и добавляйте вес понемногу.")
    return notes
