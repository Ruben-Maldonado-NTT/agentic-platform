from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import MCP
from app.schemas import MCPCreate, MCPOut

router = APIRouter()

# Dependency para obtener sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=MCPOut)
def create_mcp(mcp: MCPCreate, db: Session = Depends(get_db)):
    existing = db.query(MCP).filter(MCP.name == mcp.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="MCP already exists")
    db_mcp = MCP(**mcp.dict())
    db.add(db_mcp)
    db.commit()
    db.refresh(db_mcp)
    return db_mcp

@router.get("/", response_model=list[MCPOut])
def list_mcps(db: Session = Depends(get_db)):
    return db.query(MCP).all()
