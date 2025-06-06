from sqlmodel import SQLModel,Field
from enum import Enum
from ORM_Models.book_models import BookTransaction

class UserProfileExpose(SQLModel):
    fullName: str
    username: str
    email: str | None = None
    number_of_books_borrowed: int
    book_dues: list[BookTransaction]

class AdminProfileExpose(SQLModel):
    fullName: str
    username: str
    email: str | None = None