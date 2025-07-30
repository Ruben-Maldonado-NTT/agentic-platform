from fastapi import FastAPI
from app.routers import mcps, assignments
from app.models import Base
from app.database import engine

# Crear las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

# Instancia principal de FastAPI
app = FastAPI(
    title="MCP Registry Service",
    description="Servicio de registro y consulta de MCPs disponibles",
    version="0.1"
)

# Registrar routers
app.include_router(mcps.router, prefix="/mcps", tags=["MCPs"])
app.include_router(assignments.router, prefix="/assignments", tags=["Assignments"])
