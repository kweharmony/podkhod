from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, logic, schemas
from app.database import get_db

router = APIRouter(prefix="/measurements", tags=["Замеры"])


def _to_schema(measurement, user) -> schemas.MeasurementRead:
    """Добавляет к замеру расчётный ИМТ."""
    result = schemas.MeasurementRead.model_validate(measurement)
    result.bmi = logic.bmi(measurement.weight, user.height_cm if user else None)
    return result


@router.get("", response_model=list[schemas.MeasurementRead])
def read_measurements(user_id: int | None = None, db: Session = Depends(get_db)):
    measurements = crud.list_measurements(db, user_id=user_id)
    return [_to_schema(item, item.user) for item in measurements]


@router.get("/{measurement_id}", response_model=schemas.MeasurementRead)
def read_measurement(measurement_id: int, db: Session = Depends(get_db)):
    measurement = crud.get_measurement(db, measurement_id)
    if measurement is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Замер не найден")
    return _to_schema(measurement, measurement.user)


@router.post(
    "", response_model=schemas.MeasurementRead, status_code=status.HTTP_201_CREATED
)
def add_measurement(data: schemas.MeasurementCreate, db: Session = Depends(get_db)):
    user = crud.get_user(db, data.user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Пользователь не найден")
    measurement = crud.create_measurement(db, data)
    return _to_schema(measurement, user)


@router.patch("/{measurement_id}", response_model=schemas.MeasurementRead)
def edit_measurement(
    measurement_id: int,
    data: schemas.MeasurementUpdate,
    db: Session = Depends(get_db),
):
    measurement = crud.get_measurement(db, measurement_id)
    if measurement is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Замер не найден")
    measurement = crud.update_measurement(db, measurement, data)
    return _to_schema(measurement, measurement.user)


@router.delete("/{measurement_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_measurement(measurement_id: int, db: Session = Depends(get_db)):
    measurement = crud.get_measurement(db, measurement_id)
    if measurement is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Замер не найден")
    crud.delete_measurement(db, measurement)
