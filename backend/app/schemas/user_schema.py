from typing import List
from uuid import UUID

from pydantic import BaseModel

from .query_schema import QuerySchema


class UserBase(BaseModel):
    email: str
    name: str
    

class UserCreate(UserBase):
    password: str
    pass

class UserRead(UserBase):
    uuid: UUID

    class Config:
        orm_mode = True

class UserQuerySchema(BaseModel):
    uuid: UUID
    email: str
    name: str
    queries: List[QuerySchema]

    class Config:
        orm_mode = True