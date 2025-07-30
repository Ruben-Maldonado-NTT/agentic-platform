# models/agent.py
from sqlalchemy import Column, Integer, String, Text
from db.session import Base

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    role = Column(String)
    config = Column(Text)  # JSON plano como texto por ahora
