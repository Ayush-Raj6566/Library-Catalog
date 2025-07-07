from Login import *
from Login.login_variables import *

from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext

pwdContext = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2Scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_session():
    with Session(engine) as session:
        yield session

def verifyPassword(plainPassword,hashedPassword):
    return pwdContext.verify(plainPassword,hashedPassword)
def getHashedPassword(plainPassword):
    return pwdContext.hash(plainPassword)

def getUserDetail(username: str, user_type: str, session: Session):
    if user_type==UserType.USER:
        statement = select(UserInDB).where(UserInDB.username==username)
        result = session.exec(statement=statement).one_or_none()
        if result is not None:
            return result
        return None
    elif user_type==UserType.ADMIN:
        statement = select(AdminInDB).where(AdminInDB.username==username)
        result = session.exec(statement=statement).one_or_none()
        if result is not None:
            return result
        return None
    
def authenticateUser(username: str, user_password: str, user_type: str, session: Session):
    user = getUserDetail(username,user_type,session)
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