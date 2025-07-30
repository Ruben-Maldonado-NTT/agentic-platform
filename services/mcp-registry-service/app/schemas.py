from pydantic import BaseModel
from typing import Optional, Dict

# Esquemas para MCPs
class MCPBase(BaseModel):
    name: str
    description: Optional[str]
    type: str
    endpoint_url: str
    config_schema: Optional[Dict] = None

class MCPCreate(MCPBase):
    pass

class MCPOut(MCPBase):
    id: int

    class Config:
        orm_mode = True

# Esquemas para asignaciones de MCP a agentes
class AssignmentBase(BaseModel):
    agent_id: str
    mcp_id: int
    config_override: Optional[Dict] = None

class AssignmentOut(AssignmentBase):
    id: int

    class Config:
        orm_mode = True
