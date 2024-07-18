from datetime import datetime, timedelta

from fastapi import Depends
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from ..config import JWT_SECRET_KEY
from ..schemas import misc_schema

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 51840

def create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token:str,credentials_exception):
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = misc_schema.TokenData(email=email)

        return token_data
    except JWTError:
        raise credentials_exception
    
def generate_password_reset_token(email: str):
    expire = datetime.utcnow() + timedelta(hours=1)  # Token valid for 1 hour
    to_encode = {"exp": expire, "nbf": datetime.utcnow(), "sub": email}
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm="HS256")