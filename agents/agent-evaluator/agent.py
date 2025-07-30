import requests
import yaml
import logging

def load_config(path="config.yaml"):
    with open(path, "r") as f:
        return yaml.safe_load(f)

def get_assigned_mcps(config):
    agent_id = config["agent_id"]
    registry_url = config["mcp_registry_url"]

    try:
        response = requests.get(f"{registry_url}/assignments/agents/{agent_id}")
        response.raise_for_status()
        mcps = response.json()
        return mcps
    except requests.RequestException as e:
        logging.error(f"Error al consultar MCPs para {agent_id}: {e}")
        return []

def main():
    config = load_config()
    logging.info(f"Iniciando agente {config['name']} con ID {config['agent_id']}")

    assigned_mcps = get_assigned_mcps(config)

    for mcp in assigned_mcps:
        logging.info(f"Asignado MCP: {mcp['mcp_id']} con override: {mcp.get('config_override')}")
