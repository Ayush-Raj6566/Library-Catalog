from fastapi import APIRouter,Depends
from typing import Annotated
from Login.login_functions import oauth2Scheme,get_session
from sqlmodel import Session,select, func
import jwt
from datetime import datetime,timedelta
from Login.login_variables import *
from Exceptions.exceptions import wrong_user_access,item_not_found
from ORM_Models.login_models import UserType
from ORM_Models.book_models import Book,BookUpdate,BookTransaction,TransactionStatus
from Login.login_functions import getUserDetail

dashboard_router = APIRouter()

#------------User DashBoard Routes------------#
@dashboard_router.get("/dashboard/user/all_books")
def get_all_books(token: Annotated[str, Depends(oauth2Scheme)], session: Session = Depends(get_session)):
    payload = jwt.decode(token,SECRET_KEY,[ALGORITHM])
    curr_user_type = payload.get("user_type")
    print(curr_user_type)
    if (curr_user_type!=UserType.USER and curr_user_type!=UserType.ADMIN):
        raise wrong_user_access
    statement = select(Book)
    all_books = session.exec(statement).all()
    return all_books

@dashboard_router.get("/dashboard/user/search_book/name/{book_name}")
def get_book_by_title(book_name: str, token: Annotated[str, Depends(oauth2Scheme)], session: Session = Depends(get_session)):
    payload = jwt.decode(token,SECRET_KEY,[ALGORITHM])
    curr_user_type = payload.get("user_type")
    if (curr_user_type!=UserType.USER):
        raise wrong_user_access
    statement = select(Book).where(func.lower(Book.name).like(f"%{book_name.lower()}%"))
    book_results = session.exec(statement).all()
    return book_results

@dashboard_router.get("/dashboard/user/search_book/author/{book_author_name}")
def get_book_by_author(book_author_name: str, token: Annotated[str, Depends(oauth2Scheme)], session: Session = Depends(get_session)):
    payload = jwt.decode(token,SECRET_KEY,[ALGORITHM])
    curr_user_type = payload.get("user_type")
    if (curr_user_type!=UserType.USER):
        raise wrong_user_access
    statement = select(Book).where(func.lower(Book.author).like(f"%{book_author_name.lower()}%"))
    book_results = session.exec(statement).all()
    return book_results

@dashboard_router.get("/dashboard/user/search_book/category/{book_category}")
def get_book_by_category(book_category: str, token: Annotated[str, Depends(oauth2Scheme)], session: Session = Depends(get_session)):
    payload = jwt.decode(token,SECRET_KEY,[ALGORITHM])
    curr_user_type = payload.get("user_type")
    if (curr_user_type!=UserType.USER):
        raise wrong_user_access
    statement = select(Book).where(func.lower(Book.genre).like(f"%{book_category.lower()}%"))
    book_results = session.exec(statement).all()
    return book_results

@dashboard_router.get("/dashboard/user/my_books")
def get_all_book_transaction(token: Annotated[str, Depends(oauth2Scheme)], session: Session = Depends(get_session)):
    payload = jwt.decode(token,SECRET_KEY,[ALGORITHM])
    curr_user_type = payload.get("user_type")
    curr_user = payload.get("sub")
    if (curr_user_type!=UserType.USER):
        raise wrong_user_access
    user = getUserDetail(username=curr_user, user_type=curr_user_type, session=session)
    return user.book_dues # type: ignore

@dashboard_router.post("/dashboard/user/request_book/{book_id}")
def request_book(book_id: int, token: Annotated[str, Depends(oauth2Scheme)], session: Session = Depends(get_session)):
    payload = jwt.decode(token,SECRET_KEY,[ALGORITHM])
    curr_user_type = payload.get("user_type")
    curr_user = payload.get("sub")
    if (curr_user_type!=UserType.USER):
        raise wrong_user_access
    new_transaction = BookTransaction(
        username=curr_user,
        book_id=book_id,
        issue_date=datetime.now().date(),
        expire_date=datetime.now().date() + timedelta(days=10)
    )    
    session.add(new_transaction)
    session.commit()
    session.refresh(new_transaction)
    return new_transaction

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
    # session.refresh(new_book)
    return {"message": "Book added successfully"}

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

@dashboard_router.get("/dashboard/admin/issue_requests")
def get_issue_requests(token: Annotated[str, Depends(oauth2Scheme)], session: Session = Depends(get_session)):
    payload = jwt.decode(token,SECRET_KEY,[ALGORITHM])
    curr_user_type = payload.get("user_type")
    if (curr_user_type!=UserType.ADMIN):
        raise wrong_user_access
    issues = session.exec(select(BookTransaction).where(BookTransaction.status==TransactionStatus.PENDING)).all()
    issues_dict_arr = []
    for issue in issues:
        issues_dict_arr.append({
            "book_transaction": issue,
            "book_info": issue.book
        })
    return issues_dict_arr

@dashboard_router.patch("/dashboard/admin/issue_request/approve/{book_request_id}")
def approve_requests(book_request_id: int, token: Annotated[str, Depends(oauth2Scheme)], session: Session = Depends(get_session)):
    payload = jwt.decode(token,SECRET_KEY,[ALGORITHM])
    curr_user_type = payload.get("user_type")
    if (curr_user_type!=UserType.ADMIN):
        raise wrong_user_access
    transaction = session.get(BookTransaction,book_request_id)
    transaction.status = TransactionStatus.APPROVED # type: ignore
    session.add(transaction)
    session.commit()
    return {"message": "Approval Successful"}

@dashboard_router.patch("/dashboard/admin/issue_request/reject/{book_request_id}")
def reject_requests(book_request_id: int, token: Annotated[str, Depends(oauth2Scheme)], session: Session = Depends(get_session)):
    payload = jwt.decode(token,SECRET_KEY,[ALGORITHM])
    curr_user_type = payload.get("user_type")
    if (curr_user_type!=UserType.ADMIN):
        raise wrong_user_access
    transaction = session.get(BookTransaction,book_request_id)
    transaction.status = TransactionStatus.REJECT # type: ignore
    session.add(transaction)
    session.commit()
    return {"message": "Reject Successful"}

@dashboard_router.delete("/dashboard/admin/delete_book/{book_id}")
def delete_book(book_id: int, token: Annotated[str, Depends(oauth2Scheme)], session: Session = Depends(get_session)):
    payload = jwt.decode(token,SECRET_KEY,[ALGORITHM])
    curr_user_type = payload.get("user_type")
    if (curr_user_type!=UserType.ADMIN):
        raise wrong_user_access
    book = session.get(Book,book_id)
    if book is None:
        raise item_not_found(book_id)
    session.delete(book)
    session.commit()
    return {"message": "Book Successfully Deleted"}