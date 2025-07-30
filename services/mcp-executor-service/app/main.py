from fastapi import FastAPI
from app.database import engine
from app.models import Base
from app.routers import sample

app = FastAPI(title="mcp-executor-service", version="0.1")
Base.metadata.create_all(bind=engine)
app.include_router(sample.router, prefix="/sample", tags=["Sample"])
