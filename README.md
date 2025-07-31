# My Multi-Module App

## Overview
This project is structured to support a multi-module application, encompassing various components such as user interface, API, runtime configurations, and marketplace functionalities.

## Project Structure
```
my-multi-module-app
├── agentic-ui          # User interface components
├── api                 # API-related code (routes, controllers, services)
├── runtime             # Runtime configurations and scripts
├── mcp_marketplace     # Marketplace module functionalities
├── docker              # Docker-related files (Dockerfiles, docker-compose)
├── data                # Data storage (databases, migrations, seeds)
├── docs                # Documentation files (guides, API docs)
├── scripts             # Utility scripts for development and deployment
└── deploy              # Deployment configurations and scripts
```

## Getting Started
To get started with this project, follow the instructions below:

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd my-multi-module-app
   ```

2. **Install dependencies:**
   Depending on the module, navigate to the respective folder and install the necessary dependencies.

3. **Run the application:**
   Follow the specific instructions in the `runtime` or `docker` folder to start the application.

## Usage
Provide usage instructions for the application, including any relevant commands or configurations.

## Contributing
Contributions are welcome! Please follow the standard guidelines for contributing to this project.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Components
services/
├── platform-api/              # API central
├── scaffolding-service/       # Generador de agentes
├── agency-deployer/           # Interprete de agency.json
├── llm-facade/                # Router/controlador LLMs
├── discovery-service/         # Registro dinámico de agentes
├── mcp-registry-service/ ✅   # Registro y asignación de MCPs
├── mcp-executor-service/      # Gateway entre agente y MCP
├── runtime-controller/        # Launcher de runtimes Docker/K8s
├── agent-repo-generator/      # Generador de repositorios por agente
├── auth-service/              # Autenticación/autorización (opcional)
├── metrics-service/           # Exportador de métricas (Prometheus, etc.)

agents/
├── agent-template/ ✅          # Plantilla base de agente
├── agent-runner/              # Entrypoint común de ejecución
├── coordinator-agent/         # Componente coordinador de agencia
├── evaluator-agent/           # Componente evaluador de tareas
├── agency-orchestrator/       # Orquestador de red multiagente

mcps/
├── mcp-gmail/                 # Acceso a Gmail
├── mcp-websearch/             # Búsqueda en web
├── mcp-rag/                   # Acceso a índice RAG

ui/
├── agent-designer/            # Visual builder de agentes
├── agency-composer/           # Constructor de agencias
├── marketplace-mcps/          # UI para asignar MCPs
├── marketplace-llms/          # UI para elegir LLMs
├── deployment-monitor/        # Visualización de estado de despliegues

infra/
├── traefik-config/            # (opcional, si se customiza)
├── metrics-collector/         # Dashboards/logs Prometheus/Grafana

dev/
├── embedded-ide/              # Monaco u otro editor
├── code-executor/             # Sandbox seguro para evaluar código

## Cambiar HOSTS
sudo nano /etc/hosts

127.0.0.1 mcps.localhost
127.0.0.1 api.localhost
127.0.0.1 ui.localhost
127.0.0.1 pgadmin.localhost
127.0.0.1 akhq.localhost

# Platform Services
127.0.0.1 platform-api.localhost
127.0.0.1 scaffolding.localhost
127.0.0.1 deployer.localhost
127.0.0.1 llm.localhost
127.0.0.1 discovery.localhost
127.0.0.1 mcp-executor.localhost
127.0.0.1 runtime.localhost
127.0.0.1 repo.localhost
127.0.0.1 auth.localhost
127.0.0.1 metrics.localhost

# Agents
127.0.0.1 agent-runner.localhost
127.0.0.1 agent-coordinator.localhost
127.0.0.1 agent-evaluator.localhost
127.0.0.1 agency-orchestrator.localhost

## Commands
- Create agent from template: ./init-agent.sh agents/agent-runner
- Create service from template: ./init-fastapi-service-full.sh services/scaffolding-service traefik