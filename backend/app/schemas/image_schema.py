from pydantic import BaseModel


class ImageSchema(BaseModel):
    id: int
    url: str
    width: int
    height: int
    extension: str

    class Config:
        orm_mode = True