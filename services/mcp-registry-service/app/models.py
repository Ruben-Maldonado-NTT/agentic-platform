from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class MCP(Base):
    __tablename__ = "mcps"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String, nullable=False)  # Ej: 'connector', 'rag', 'tool'
    endpoint_url = Column(String, nullable=False)
    config_schema = Column(JSON, nullable=True)

class AgentMCPAssignment(Base):
    __tablename__ = "agent_mcps"
    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, nullable=False)
    mcp_id = Column(Integer, ForeignKey("mcps.id"), nullable=False)
    config_override = Column(JSON, nullable=True)
