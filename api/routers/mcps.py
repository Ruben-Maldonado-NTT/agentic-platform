from fastapi import APIRouter, HTTPException, Body
from utils.mcp_loader import MCPLoader
import os
import json
from pathlib import Path
from fastapi import Path

router = APIRouter()

@router.get("/mcps")
def list_mcps():
    # Obtener la ruta absoluta al directorio raíz del proyecto
    base_path = Path(__file__).resolve().parents[2] / "mcp_marketplace"
    
    if not base_path.exists():
        raise HTTPException(status_code=500, detail="MCP marketplace not found")

    mcps = []
    for folder in os.listdir(base_path):
        manifest_path = base_path / folder / "manifest.json"
        if manifest_path.exists():
            with open(manifest_path) as f:
                data = json.load(f)
                data["folder"] = folder
                mcps.append(data)

    return mcps

@router.post("/mcps/load")
def load_mcp(
    name: str = Body(...),
    config: dict = Body(default={})
):
    try:
        loader = MCPLoader(mcp_name=name)
        instance = loader.load_class(config)
        # ejemplo: llamar a método `get_memory()` si existe
        if hasattr(instance, "get_memory"):
            return {"status": "loaded", "result": instance.get_memory()}
        return {"status": "loaded", "message": f"{name} MCP instanciado correctamente"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

@router.post("/mcps/{name}/call")
def call_mcp_method(
    name: str = Path(...),
    method: str = Body(...),
    args: list = Body(default=[]),
    kwargs: dict = Body(default={})
):
    try:
        loader = MCPLoader(mcp_name=name)
        instance = loader.load_class()

        if not hasattr(instance, method):
            raise AttributeError(f"Método '{method}' no encontrado en MCP '{name}'")

        func = getattr(instance, method)

        if not callable(func):
            raise TypeError(f"'{method}' no es una función ejecutable")

        result = func(*args, **kwargs)
        return {"status": "ok", "result": result}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
