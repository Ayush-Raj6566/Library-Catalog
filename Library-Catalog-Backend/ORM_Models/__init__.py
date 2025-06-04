from ORM_Models.book_models import *
from ORM_Models.login_models import *
from ORM_Models.profile_models import *
from sqlmodel import SQLModel,create_engine

MYSQL_URL = "mysql+mysqlconnector://deban:Horror@172.17.208.1:3306/serverayush"

engine = create_engine(url=MYSQL_URL,echo=True)

