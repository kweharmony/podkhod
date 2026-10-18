import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

# ---------- Пользователь ----------


class UserCreate(BaseModel):
    email: EmailStr
    name: str = Field(min_length=1, max_length=100)
    height_cm: float | None = Field(default=None, gt=0, lt=300)


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    name: str
    height_cm: float | None


# ---------- Упражнение ----------


class ExerciseCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    body_part: str = Field(min_length=1, max_length=50)
    equipment: str = Field(min_length=1, max_length=50)
    target: str = Field(min_length=1, max_length=100)
    instruction: str | None = None


class ExerciseUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    body_part: str | None = Field(default=None, min_length=1, max_length=50)
    equipment: str | None = Field(default=None, min_length=1, max_length=50)
    target: str | None = Field(default=None, min_length=1, max_length=100)
    instruction: str | None = None


class ExerciseRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    body_part: str
    equipment: str
    target: str
    instruction: str | None


# ---------- Подход ----------


class SetCreate(BaseModel):
    weight: float = Field(ge=0, le=1000)
    reps: int = Field(ge=1, le=1000)


class SetRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    weight: float
    reps: int


# ---------- Упражнение в тренировке ----------


class WorkoutExerciseCreate(BaseModel):
    exercise_id: int
    position: int = Field(default=1, ge=1)


class WorkoutExerciseRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    position: int
    exercise: ExerciseRead
    sets: list[SetRead]
    one_rep_max: float | None = None


# ---------- Тренировка ----------


class WorkoutCreate(BaseModel):
    user_id: int
    date: datetime.date
    title: str = Field(min_length=1, max_length=200)
    note: str | None = None


class WorkoutUpdate(BaseModel):
    date: datetime.date | None = None
    title: str | None = Field(default=None, min_length=1, max_length=200)
    note: str | None = None


class WorkoutRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    date: datetime.date
    title: str
    note: str | None


class WorkoutDetail(WorkoutRead):
    exercises: list[WorkoutExerciseRead]
    volume: float


# ---------- Замер ----------


class MeasurementCreate(BaseModel):
    user_id: int
    date: datetime.date
    weight: float = Field(gt=0, lt=500)
    chest: float | None = Field(default=None, gt=0, lt=300)
    waist: float | None = Field(default=None, gt=0, lt=300)


class MeasurementUpdate(BaseModel):
    date: datetime.date | None = None
    weight: float | None = Field(default=None, gt=0, lt=500)
    chest: float | None = Field(default=None, gt=0, lt=300)
    waist: float | None = Field(default=None, gt=0, lt=300)


class MeasurementRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    date: datetime.date
    weight: float
    chest: float | None
    waist: float | None
    bmi: float | None = None


# ---------- Совет помощника ----------


class AdviceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    created_at: datetime.date
    text: str
    source: str
