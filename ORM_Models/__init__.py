from ORM_Models.book_models import *
from ORM_Models.login_models import *
from ORM_Models.profile_models import *
from sqlmodel import SQLModel,create_engine
from config import settings

MYSQL_URL = "mysql+mysqlconnector://deban:Horror@172.17.208.1:3306/serverayush"

engine = create_engine(url=settings.db_url,echo=True)

