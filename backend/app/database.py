import asyncio
import os

from sqlalchemy.ext.asyncio import (AsyncEngine, AsyncSession,
                                    create_async_engine)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.future import select
from sqlalchemy.orm import sessionmaker

from .config import DATABASE_URL
from .logging_config import logger

logger.info(f"Using DATABASE_URL={DATABASE_URL}")

engine = create_async_engine(DATABASE_URL)

AsyncSessionLocal = sessionmaker(
    bind=engine, 
    expire_on_commit=False, 
    class_=AsyncSession
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def create_tables(engine: AsyncEngine):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def startup():
    await create_tables(engine)

if __name__ == "__main__":
    asyncio.run(startup())