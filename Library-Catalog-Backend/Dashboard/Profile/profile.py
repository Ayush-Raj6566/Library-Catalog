from fastapi import APIRouter,Depends
import jwt
from typing import Annotated
from sqlmodel import Session,select
from ORM_Models.login_models import UserType
from Login.login_functions import oauth2Scheme,get_session
from Login.login_variables import *
from ORM_Models.login_models import UserInDB,AdminInDB
from ORM_Models.profile_models import *
from Exceptions.exceptions import user_not_found

profile_router = APIRouter()

@profile_router.get("/dashboard/profile")
def get_profile_detail(token: Annotated[str, Depends(oauth2Scheme)], session: Session = Depends(get_session)):
    payload = jwt.decode(token,SECRET_KEY,[ALGORITHM])
    username = payload.get("sub")
    user_type = payload.get("user_type")
    profile_detail = None
    if user_type==UserType.USER:
        statement = select(UserInDB).where(UserInDB.username==username)
        profile_detail = session.exec(statement).first()
    elif user_type==UserType.ADMIN:
        statement = select(AdminInDB).where(AdminInDB.username==username)
        profile_detail = session.exec(statement).first()
    if profile_detail==None:
        raise user_not_found
    profile_detail_dict = profile_detail.model_dump(exclude={"hashed_password"})
    if user_type==UserType.USER:
        return UserProfileExpose(**profile_detail_dict)
    elif user_type==UserType.ADMIN:
        return AdminProfileExpose(**profile_detail_dict)