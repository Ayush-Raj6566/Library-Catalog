from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from ORM_Models import SQLModel,engine
from Login.login import login_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:3000"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

app.include_router(router=login_router,tags=["Login"])




@app.get("/")
def welcome():
    return {"message" : "Welcome to home of books"}