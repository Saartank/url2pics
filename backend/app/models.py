import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = 'users'

    uuid = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    password = Column(String(255), nullable=False)
    queries = relationship("Queries", back_populates="user")

    def __repr__(self):
        return f"<User(uuid={self.uuid}, email={self.email}, name={self.name})>"

    
class Queries(Base):
    __tablename__ = 'queries'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    url = Column(String(255), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.uuid'))
    user = relationship("User", back_populates="queries")
    images = relationship("Images", back_populates="query")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    def __repr__(self):
        return f"<Queries(id={self.id}, url={self.url}, created_at={self.created_at})>"

class Images(Base):
    __tablename__ = 'images'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    url = Column(String(255), nullable=False)
    query_id = Column(Integer, ForeignKey('queries.id'))
    query = relationship("Queries", back_populates="images")

    width = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)
    extension = Column(String(10), nullable=False)

    def __repr__(self):
        return (f"<Images(id={self.id}, url={self.url}, width={self.width}, "
                f"height={self.height}, extension={self.extension})>")