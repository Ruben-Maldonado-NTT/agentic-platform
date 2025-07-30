import importlib.util
import json
from pathlib import Path
from typing import Any

class MCPLoader:
    def __init__(self, mcp_name: str, base_path: Path = None):
        self.base_path = base_path or Path(__file__).resolve().parents[2] / "mcp_marketplace"
        self.mcp_path = self.base_path / mcp_name
        self.instance = None
        self.manifest = None

    def load_manifest(self):
        manifest_path = self.mcp_path / "manifest.json"
        if not manifest_path.exists():
            raise FileNotFoundError(f"Manifest not found for MCP '{self.mcp_path}'")
        with open(manifest_path) as f:
            self.manifest = json.load(f)
        return self.manifest

    def load_class(self, config: dict = {}) -> Any:
        if self.manifest is None:
            self.load_manifest()

        entrypoint = self.mcp_path / self.manifest["entrypoint"]
        class_name = self.manifest["class"]

        if not entrypoint.exists():
            raise FileNotFoundError(f"Entrypoint '{entrypoint}' not found")

        # Cargar módulo dinámicamente
        spec = importlib.util.spec_from_file_location("mcp_module", str(entrypoint))
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)

        # Instanciar la clase con config
        cls = getattr(module, class_name)
        self.instance = cls(**config)
        return self.instance
