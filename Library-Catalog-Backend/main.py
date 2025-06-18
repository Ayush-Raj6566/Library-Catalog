from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from ORM_Models import SQLModel,engine
from Login.login import login_router
from Dashboard.dashboard import dashboard_router
from Dashboard.Profile.profile import profile_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

app.include_router(router=login_router,tags=["Login"])
app.include_router(router=dashboard_router,tags=["Dashboard"])
app.include_router(router=profile_router,tags=["Profile"])



@app.get("/home")
def welcome():
    return {"message" : "Welcome to home of books"}