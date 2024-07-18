from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel

from .image_schema import ImageSchema


class QuerySchema(BaseModel):
    id: int
    url: str
    created_at: datetime
    user_id: UUID
    images: List[ImageSchema]

    class Config:
        orm_mode = True

class QueryThumbnailSchema(BaseModel):
    id: int
    url: str
    created_at: datetime
    user_id: UUID

    class Config:
        orm_mode = True