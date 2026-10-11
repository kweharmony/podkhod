from fastapi import FastAPI

from app.database import Base, engine
from app.routers import advice, exercises, measurements, users, workouts

# Создание таблиц при старте приложения
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Podkhod API", description="Дневник силовых тренировок")

app.include_router(users.router)
app.include_router(exercises.router)
app.include_router(workouts.router)
app.include_router(measurements.router)
app.include_router(advice.router)


@app.get("/health", tags=["Служебное"])
def health():
    return {"status": "ok"}
