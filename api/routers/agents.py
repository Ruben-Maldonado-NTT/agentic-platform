from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from db.session import SessionLocal
from models.agent import Agent
from fastapi import Path


router = APIRouter()

class AgentCreate(BaseModel):
    name: str
    role: str
    config: str  # En el futuro puede ser un Dict

class AgentOut(BaseModel):
    id: int
    name: str
    role: str
    config: str

    class Config:
        orm_mode = True

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.post("/agents", response_model=AgentOut)
async def create_agent(agent: AgentCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent).where(Agent.name == agent.name))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Agent already exists")

    db_agent = Agent(**agent.dict())
    db.add(db_agent)
    await db.commit()
    await db.refresh(db_agent)
    return db_agent

@router.get("/agents", response_model=list[AgentOut])
async def list_agents(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent))
    agents = result.scalars().all()
    return agents
        
@router.delete("/agents/{agent_id}", status_code=204)
async def delete_agent(
    agent_id: int = Path(..., description="ID del agente a eliminar"),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    agent = result.scalar_one_or_none()

    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    await db.delete(agent)
    await db.commit()
    return None

