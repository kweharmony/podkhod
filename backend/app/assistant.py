"""Помощник: превращает цифры тренировок в человеческий совет.

Расчёты делаем сами (logic.py), модель только формулирует текст.
Если ключа нет или сервис недоступен — отдаём совет по правилам.
"""

import httpx

from app import logic
from app.config import settings

SYSTEM_PROMPT = (
    "Ты тренер по силовым тренировкам. По данным дневника дай короткий совет, "
    "что делать на следующей тренировке. Два-три предложения, без списков, "
    "дружелюбно и по делу. Не выдумывай числа, которых нет в данных."
)


def build_prompt(facts: dict, notes: list[str]) -> str:
    """Собирает текст запроса к модели из фактов и наблюдений."""
    lines = [
        f"Тренировок за две недели: {facts['workouts_two_weeks']}",
        f"Объём за две недели: {facts['volume_two_weeks']} кг",
        f"Объём за предыдущие две недели: {facts['volume_previous_two_weeks']} кг",
    ]
    if facts.get("days_since_last_workout") is not None:
        lines.append(f"Дней с последней тренировки: {facts['days_since_last_workout']}")
    if facts.get("body_weight"):
        lines.append(f"Вес тела: {facts['body_weight']} кг")
    if facts.get("body_weight_change") is not None:
        lines.append(f"Изменение веса тела: {facts['body_weight_change']} кг")

    for exercise in facts["exercises"]:
        lines.append(
            f"{exercise['name']}: сейчас 1RM {exercise['current_one_rep_max']} кг, "
            f"лучший {exercise['best_one_rep_max']} кг, тренировок {exercise['sessions']}"
        )

    lines.append("")
    lines.append("Замечания из расчётов:")
    lines.extend(f"- {note}" for note in notes)
    return "\n".join(lines)


def ask_model(prompt: str) -> str | None:
    """Запрос к Polza AI. Возвращает текст совета или None, если не получилось."""
    if not settings.polza_api_key:
        return None

    try:
        response = httpx.post(
            settings.polza_url,
            headers={"Authorization": f"Bearer {settings.polza_api_key}"},
            json={
                "model": settings.polza_model,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                # GLM 5.3 Flash сначала "думает": часть лимита уходит на рассуждения,
                # поэтому запас нужен с избытком, иначе ответ придёт пустым
                "max_tokens": 1000,
                "temperature": 0.7,
            },
            timeout=30,
        )
        response.raise_for_status()
        text = (response.json()["choices"][0]["message"]["content"] or "").strip()
        if not text:
            print("[помощник] модель вернула пустой ответ")
            return None
        return text
    except httpx.HTTPStatusError as error:
        print(f"[помощник] сервис ответил {error.response.status_code}: {error.response.text}")
        return None
    except (httpx.HTTPError, KeyError, IndexError) as error:
        print(f"[помощник] не удалось получить ответ: {error}")
        return None


def make_advice(workouts, measurements) -> tuple[str, str]:
    """Готовит совет. Возвращает текст и источник: "ai" или "rules"."""
    facts = logic.collect_facts(workouts, measurements)
    notes = logic.rule_based_advice(facts)

    text = ask_model(build_prompt(facts, notes))
    if text:
        return text, "ai"
    return " ".join(notes), "rules"
