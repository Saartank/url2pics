from typing import List, Optional

from pydantic import BaseModel, HttpUrl


class UrlData(BaseModel):
    url: HttpUrl

class UrlList(BaseModel):
    urls: List[HttpUrl]

class TokenData(BaseModel):
    email: Optional[str] = None