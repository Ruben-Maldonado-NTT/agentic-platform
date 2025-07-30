from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import AgentMCPAssignment
from app.schemas import AssignmentBase, AssignmentOut

router = APIRouter()

# Dependency para sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=AssignmentOut)
def assign_mcp(assignment: AssignmentBase, db: Session = Depends(get_db)):
    db_assignment = AgentMCPAssignment(**assignment.dict())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

@router.get("/agents/{agent_id}", response_model=list[AssignmentOut])
def get_agent_mcps(agent_id: str, db: Session = Depends(get_db)):
    return db.query(AgentMCPAssignment).filter_by(agent_id=agent_id).all()
