from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def hello():
    return {"message": "Hello from agent-repo-generator"}
