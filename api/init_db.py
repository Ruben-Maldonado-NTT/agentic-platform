# init_db.py
from dotenv import load_dotenv
load_dotenv()

from db.session import Base, engine
import models.agent

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    import asyncio
    asyncio.run(create_tables())
