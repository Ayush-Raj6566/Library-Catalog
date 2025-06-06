from fastapi import APIRouter,Depends
from typing import Annotated
from Login.login_functions import oauth2Scheme,get_session
from sqlmodel import Session,select
import jwt
from Login.login_variables import *
from Exceptions.exceptions import wrong_user_access,item_not_found
from ORM_Models.login_models import UserType
from ORM_Models.book_models import Book,BookUpdate

dashboard_router = APIRouter()

#------------User DashBoard Routes------------#
@dashboard_router.get("/dashboard/user/all_books")
def get_all_books(token: Annotated[str, Depends(oauth2Scheme)], session: Session = Depends(get_session)):
    payload = jwt.decode(token,SECRET_KEY,[ALGORITHM])
    curr_user_type = payload.get("user_type")
    if (curr_user_type!=UserType.USER):
        raise wrong_user_access
    statement = select(Book)
    all_books = session.exec(statement).all()
    return all_books

@dashboard_router.get("/dashboard/user/search_book/{book_name}")
def get_book_by_title(book_name: str, token: Annotated[str, Depends(oauth2Scheme)], session: Session = Depends(get_session)):
    payload = jwt.decode(token,SECRET_KEY,[ALGORITHM])
    curr_user_type = payload.get("user_type")
    if (curr_user_type!=UserType.USER):
        raise wrong_user_access
    statement = select(Book).where(Book.name==book_name)
    book_results = session.exec(statement).all()
    return book_results

@dashboard_router.get("/dashboard/user/search_book/{book_author_name}")
def get_book_by_author(book_author_name: str, token: Annotated[str, Depends(oauth2Scheme)], session: Session = Depends(get_session)):
    payload = jwt.decode(token,SECRET_KEY,[ALGORITHM])
    curr_user_type = payload.get("user_type")
    if (curr_user_type!=UserType.USER):
        raise wrong_user_access
    statement = select(Book).where(Book.author==book_author_name)
    book_results = session.exec(statement).all()
    return book_results

@dashboard_router.get("/dashboard/user/search_book/{book_category}")
def get_book_by_category(book_category: str, token: Annotated[str, Depends(oauth2Scheme)], session: Session = Depends(get_session)):
    payload = jwt.decode(token,SECRET_KEY,[ALGORITHM])
    curr_user_type = payload.get("user_type")
    if (curr_user_type!=UserType.USER):
        raise wrong_user_access
    statement = select(Book).where(Book.genre==book_category)
    book_results = session.exec(statement).all()
    return book_results

#------------Admin DashBoard Routes------------#
@dashboard_router.post("/dashboard/admin/add_book")
def add_book(token: Annotated[str, Depends(oauth2Scheme)], book_detail: Book, session: Session = Depends(get_session)):
    payload = jwt.decode(token,SECRET_KEY,[ALGORITHM])
    curr_user_type = payload.get("user_type")
    if (curr_user_type!=UserType.ADMIN):
        raise wrong_user_access
    new_book = Book(**book_detail.model_dump(exclude_unset=True))
    session.add(new_book)
    session.commit()
    session.refresh(new_book)
    return new_book

@dashboard_router.patch("/dashboard/admin/update_book/{book_id}")
def update_book_detail(book_id: int, token: Annotated[str, Depends(oauth2Scheme)], book_detail: BookUpdate, session: Session = Depends(get_session)):
    payload = jwt.decode(token,SECRET_KEY,[ALGORITHM])
    curr_user_type = payload.get("user_type")
    if (curr_user_type!=UserType.ADMIN):
        raise wrong_user_access
    book_to_be_changed = session.get(Book,book_id)
    if book_to_be_changed is None:
        raise item_not_found(book_id)
    book_to_be_changed.sqlmodel_update(book_detail.model_dump(exclude_unset=True))
    session.add(book_to_be_changed)
    session.commit()
    session.refresh(book_to_be_changed)
    return book_to_be_changed

