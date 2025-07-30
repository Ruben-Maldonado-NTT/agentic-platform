#!/bin/bash

# 🚀 FastAPI full microservice scaffold + docker-compose snippet
# Usage: ./init-fastapi-service-full.sh services/platform-api [traefik]

SERVICE_PATH=$1
ENABLE_TRAEFIK=$2

if [ -z "$SERVICE_PATH" ]; then
  echo "❌ Usage: $0 <path-to-service> [traefik]"
  exit 1
fi

SERVICE_NAME=$(basename "$SERVICE_PATH")
PORT=8000

echo "📁 Creating full FastAPI service: $SERVICE_NAME"

# Crear carpetas
mkdir -p "$SERVICE_PATH/app/routers"
touch "$SERVICE_PATH/app/__init__.py"
touch "$SERVICE_PATH/app/routers/__init__.py"

# main.py
cat > "$SERVICE_PATH/app/main.py" <<EOF
from fastapi import FastAPI
from app.database import engine
from app.models import Base
from app.routers import sample

app = FastAPI(title="$SERVICE_NAME", version="0.1")
Base.metadata.create_all(bind=engine)
app.include_router(sample.router, prefix="/sample", tags=["Sample"])
EOF

# sample router
cat > "$SERVICE_PATH/app/routers/sample.py" <<EOF
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def hello():
    return {"message": "Hello from $SERVICE_NAME"}
EOF

# models.py
cat > "$SERVICE_PATH/app/models.py" <<EOF
from sqlalchemy.orm import declarative_base
Base = declarative_base()
# Add models here
EOF

# schemas.py
cat > "$SERVICE_PATH/app/schemas.py" <<EOF
# Add Pydantic schemas here
EOF

# database.py
cat > "$SERVICE_PATH/app/database.py" <<EOF
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
EOF

# requirements.txt
cat > "$SERVICE_PATH/requirements.txt" <<EOF
fastapi==0.103.2
uvicorn[standard]==0.23.2
sqlalchemy==2.0.20
pydantic==1.10.13
EOF

# Dockerfile
cat > "$SERVICE_PATH/Dockerfile" <<EOF
FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "$PORT"]
EOF

# .env
cat > "$SERVICE_PATH/.env" <<EOF
DATABASE_URL=sqlite:///./dev.db
EOF

# ✅ docker-compose snippet
echo ""
echo "📦 Docker Compose snippet:"
echo "---------------------------------------------------"
echo "  $SERVICE_NAME:"
echo "    build: ./$SERVICE_PATH"
echo "    container_name: $SERVICE_NAME"
echo "    restart: always"
echo "    env_file:"
echo "      - ./services/.env.docker"
echo "    ports:"
echo "      - \"$PORT:$PORT\""
echo "    depends_on:"
echo "      - postgres"

if [ "$ENABLE_TRAEFIK" == "traefik" ]; then
  echo "    labels:"
  echo "      - \"traefik.enable=true\""
  echo "      - \"traefik.http.routers.${SERVICE_NAME}.rule=Host(\\\`${SERVICE_NAME}.localhost\\\`)\""
  echo "      - \"traefik.http.services.${SERVICE_NAME}.loadbalancer.server.port=$PORT\""
fi
echo "---------------------------------------------------"

echo "✅ Done: service scaffolded in $SERVICE_PATH"
