from fastapi import FastAPI

from app.database import Base, engine
from app.migrate_auth import add_password_column
from app.routers import auth, advice, exercises, measurements, users, workouts

# Создание таблиц при старте приложения
Base.metadata.create_all(bind=engine)
add_password_column()

app = FastAPI(title="Podkhod API", description="Дневник силовых тренировок", root_path="/api")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(exercises.router)
app.include_router(workouts.router)
app.include_router(measurements.router)
app.include_router(advice.router)


@app.get("/health", tags=["Служебное"])
def health():
    return {"status": "ok"}
