from Login import *
from Login.login_functions import *
from Login.login_variables import *
from fastapi import Depends, APIRouter, HTTPException, status

login_router = APIRouter()


@login_router.post("/api/login")
def login(fromData: Login, session: Session = Depends(get_session)) -> Token:
    user = authenticateUser(username=fromData.username, user_password=fromData.password, user_type=fromData.user_type, session=session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    accessTokenExpire = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    accessToken = createJWT(data={"sub":user.username,"user_type": fromData.user_type},expireDelta=accessTokenExpire)
    return Token(access_token=accessToken,token_type="bearer")

@login_router.post("/api/user/signup",status_code=201)
def signup(newUser : SignUp, session: Session = Depends(get_session)):
    statement = select(UserInDB).where(UserInDB.username==newUser.username)
    result = session.exec(statement=statement).one_or_none()
    if result is  not None:
        raise HTTPException(
        status_code=400,
        detail="Username already registered",
        )
    hashedPassword = getHashedPassword(newUser.password)
    newUserObj = UserInDB(**{
            "fullName": newUser.fullName,
            "username": newUser.username,
            "email": newUser.email,
            "hashed_password": hashedPassword,
            "number_of_books_borrowed": 0
        })
    session.add(newUserObj)
    session.commit()
    session.refresh(newUserObj)
    return {"msg": "User successfully signedUp"}