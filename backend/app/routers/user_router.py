from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import Session

from .. import database, models
from ..authentication import oauth2
from ..authentication.hashing import Hash
from ..schemas.user_schema import UserCreate, UserRead

router = APIRouter(
    prefix="/users",
    tags=['User APIs']
)

get_db = database.get_db


@router.post('/', response_model=UserRead)
async def add_user(request: UserCreate, db: AsyncSession = Depends(get_db)):
    
    existing_user_query = await db.execute(select(models.User).where(models.User.email == request.email))
    existing_user = existing_user_query.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    try:
        new_user = models.User(name=request.name, email=request.email, password=Hash.bcrypt(request.password))
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Could not register user")

@router.get('/current', response_model=UserRead)
def get_current_user(current_user: UserRead = Depends(oauth2.get_current_user)):
    return current_user

@router.get("/", response_model=List[UserRead])
async def read_all_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.User))
    users = result.scalars().all()
    return users

@router.get("/{user_uuid}", response_model=UserRead)
async def read_user(user_uuid: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.User).filter(models.User.uuid == user_uuid))
    db_user = result.scalars().first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

