# api/main.py
from fastapi import FastAPI
from dotenv import load_dotenv
import os

if os.path.exists("../services/.env.local"):
    load_dotenv("../services/.env.local")
else:
    load_dotenv("../services/.env.docker")

from routers.agents import router as agents_router
from routers.mcps import router as mcps_router


print("✅ POSTGRES_HOST =", os.getenv("POSTGRES_HOST"))
print("✅ POSTGRES_PORT =", os.getenv("POSTGRES_PORT"))
print("✅ POSTGRES_DB =", os.getenv("POSTGRES_DB"))
print("✅ POSTGRES_USER =", os.getenv("POSTGRES_USER"))
print("✅ POSTGRES_PASSWORD =", os.getenv("POSTGRES_PASSWORD"))


app = FastAPI()
app.include_router(agents_router)
app.include_router(mcps_router)


@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/env-check")
async def env_check():
    return {
        "host": os.getenv("POSTGRES_HOST"),
        "port": os.getenv("POSTGRES_PORT"),
        "db": os.getenv("POSTGRES_DB")
    }
