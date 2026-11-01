from sqlalchemy import inspect, text
from app.database import engine


def add_password_column():
    columns = {column["name"] for column in inspect(engine).get_columns("user")}
    if "password_hash" not in columns:
        with engine.begin() as connection:
            connection.execute(text('ALTER TABLE "user" ADD COLUMN password_hash VARCHAR(255)'))
