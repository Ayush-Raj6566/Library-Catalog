from Login import *
from Login.login_variables import *

from typing import Annotated
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status

pwdContext = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2Scheme = OAuth2PasswordBearer(tokenUrl="login")

def verifyPassword(plainPassword,hashedPassword):
    return pwdContext.verify(plainPassword,hashedPassword)
def getHashedPassword(plainPassword):
    return pwdContext.hash(plainPassword)

def getUserDetail(username: str,user_type: str):
    if user_type==UserType.USER:
        with Session(engine) as session:
            statement = select(UserInDB).where(UserInDB.username==username)
            result = session.exec(statement=statement).one_or_none()
            if result is not None:
                return result
            return None
    elif user_type==UserType.ADMIN:
        with Session(engine) as session:
            statement = select(AdminInDB).where(AdminInDB.username==username)
            result = session.exec(statement=statement).one_or_none()
            if result is not None:
                return result
            return None
    
def authenticateUser(username: str,user_password: str,user_type: str):
    user = getUserDetail(username,user_type)
    if not user:
        return False
    if not verifyPassword(user_password,user.hashed_password):
        return False
    return user

def createJWT(data: dict, expireDelta: timedelta | None = None):
    copiedData = data.copy()
    if expireDelta:
        expire = datetime.now(timezone.utc) + expireDelta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    copiedData.update({"exp" : expire})
    encodedJWT = jwt.encode(copiedData,SECRET_KEY,algorithm=ALGORITHM)
    return encodedJWT

async def getCurrentUser(token : Annotated[str,Depends(oauth2Scheme)]):
    credentialsException = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        username = payload.get('sub')
        user_type = payload.get('user_type')
        print(payload)
        if username is None:
            raise credentialsException
        tokenData = TokenData(username=username,user_type=user_type)
    except InvalidTokenError:
        raise credentialsException
    user = getUserDetail(username=tokenData.username,user_type=tokenData.user_type)
    if user is None:
        raise credentialsException
    return user  

def get_session():
    with Session(engine) as session:
        yield session