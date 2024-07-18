from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import AsyncSession, Base, create_tables, engine, get_db
from .logging_config import logger
from .routers import authentication_router, parse_router, user_router

logger.info("Initializing FastAPI app!")

app = FastAPI()

@app.on_event("startup")
async def on_startup():
    await create_tables(engine)  # Ensures tables are created asynchronously

@app.on_event("shutdown")
async def shutdown():
    await engine.dispose()  # Properly dispose of the engine when app shuts down

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(authentication_router.router)
app.include_router(user_router.router)
app.include_router(parse_router.router)

@app.get("/", summary="Health Check", description="Returns the status of the API along with the current date and time.")
def read_root():
    current_time = datetime.utcnow().isoformat()
    logger.info("Health Check endpoint accessed")
    return {
        "status": "ok",
        "message": "API is healthy",
        "timestamp": current_time
    }