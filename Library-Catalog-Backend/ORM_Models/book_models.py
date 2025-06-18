from sqlmodel import SQLModel,Field,Relationship
from enum import Enum
from datetime import date

class Genre(str,Enum):
    HORROR = "Horror"
    COMEDY = "Comedy"
    ACTION = "Action"

class TransactionStatus(str, Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECT = "Rejected"

class Book(SQLModel, table = True):
    book_id: int | None = Field(default=None,primary_key=True)
    name: str
    author: str
    genre: Genre
    number_of_pages: int
    publish_data: date
    publication: str
    number_of_available_copies: int

    transactions: list["BookTransaction"] = Relationship(back_populates = "book")

class BookTransaction(SQLModel,table=True):
    book_transaction_id: int | None = Field(default=None,primary_key=True)
    username: str = Field(foreign_key = "userindb.username")
    book_id: int = Field(foreign_key = "book.book_id")
    issue_date: date
    expire_date: date
    status: TransactionStatus = TransactionStatus.PENDING

    borrowers: list["UserInDB"] = Relationship(back_populates="book_dues") # type: ignore
    book: Book = Relationship(back_populates="transactions")

class BookUpdate(SQLModel):
    name: str | None = None
    author: str | None = None
    genre: Genre | None = None
    number_of_pages: int | None = None
    publish_data: date | None = None
    publication: str | None = None
    number_of_available_copies: int | None = None