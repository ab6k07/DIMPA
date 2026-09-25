from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    code = Column(String(20), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)

    def __repr__(self):
        return f"<Department(id={self.id}, name='{self.name}', code='{self.code}')>"
