from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from .. import database, models
from ..logging_config import logger
from . import token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


async def get_current_user(request: Request, db: AsyncSession = Depends(database.get_db), token_str: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token_str:
        raise credentials_exception

    token_data = token.verify_token(token_str, credentials_exception)

    result = await db.execute(select(models.User).filter(models.User.email == token_data.email))
    user = result.scalars().first()
    if not user:
        raise credentials_exception

    return user