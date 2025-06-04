from sqlmodel import SQLModel,Field,Relationship
from enum import Enum
from ORM_Models.book_models import BookTransaction

class Base(SQLModel):
    fullName: str
    username: str = Field(primary_key = True)
    email: str | None = None

class UserInDB(Base,table=True):
    hashed_password: str
    number_of_books_borrowed: int
    
    book_dues: list[BookTransaction] = Relationship(back_populates="borrowers")

class AdminInDB(Base,table=True):
    hashed_password: str  

class UserType(str, Enum):
    USER = "User"
    ADMIN = "Admin"

class Login(SQLModel):
    username: str
    password: str
    user_type: UserType

class SignUp(Login):
    fullName: str
    email: str 
    user_type: UserType = UserType.USER