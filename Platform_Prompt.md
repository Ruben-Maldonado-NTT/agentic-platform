Estoy construyendo una plataforma modular y distribuida para el diseño, despliegue y orquestación de agentes inteligentes. 

Quiero que me ayudes a redefinir la arquitectura desde cero, organizando sus capas y componentes a alto nivel, y generando progresivamente los bloques funcionales necesarios para ejecutarla en entorno local y Docker/Kubernetes.

## Alcance de la plataforma

- La plataforma permite diseñar visualmente **agentes** y agruparlos en **agencias**.
- Cada agente tiene su propio runtime aislado, puede escalar independientemente y se comunica mediante Kafka.
- Cada agente puede tener asignados MCPs (Model Context Protocols) que actúan como capacidades externas modulares (ej: contexto, RAG, herramientas web).
- La comunicación entre agentes y agencias sigue un protocolo A2A estandarizado.
- Cada agencia incluye un **agente coordinador** y un **agente evaluador**.
- La plataforma tiene un componente de **discovery service** para registrar agentes desplegados y facilitar su localización y uso.
- Debe de haber un marketplace de LLMs disponibles integrados a traves de un componente llm-facade.
- Debe de haber un marketplace de MCPs disponibles para ser utilizados a la hora de crear un agente.
- A la hora de generar una agencia se podrán incluir agentes desplegados del catálogo recopilado por el componente de discovery de agentes.

## Componentes actuales del sistema

### Plataforma (backend y control):
- FastAPI con endpoints para gestión de agentes, agencias, MCPs
- PostgreSQL como persistencia
- Kafka como bus de eventos
- AKHQ y pgAdmin para monitoreo visual
- De cara al generador de agentes se deberá definir un scaffolding inicial de agentes que incluya un framework de gestión de agentes y de coordinación LangGraph o similares.
- `llm-facade` que apantalla y controla el acceso a LLMs (incluye logging, rate-limiting, ruteo)
- Runtime independiente para cada agente (`agent-runtime-X`)
- Discovery Service que mantiene el registro de todos los agentes activos

### UI Visual:
- Basada en React + React Flow
- Permite diseñar agentes, configurar MCPs, asignar contexto, definir guardrails
- Permite crear agencias como contenedores visuales de agentes
- Genera una definición JSON exportable (`agency.json`) que describe:
    - agentes, coordinador, evaluador
    - MCPs por agente
    - relaciones y flujos de mensajes
    - configuración de despliegue

## Cada agencia incluye:
- Capacidad para incorporar agentes previamente diseñados.
- Capacidad para definir áreas de networking específicas para la comunicación entre sus agentes.
- Capacidad para comunicarse con otras agencias mediante un protocolo estandar para ello como A2A.
- Componentes específicos a nivel de agencia como son Agente Operador, Agente Evaluador.

## Cada agente incluye:
- `agent.py`: código fuente con su lógica
- `config.yaml`: configuración y parámetros
- `context/`: archivos de conocimiento
- `mcps/`: plugins MCP locales
- `rag/`: índice vectorial o fuente documental
- `guardrails/`: validaciones de entrada/salida
- `memory/`: memoria corta o persistente
- `comm/`: configuración de comunicación (Kafka topics, A2A scopes)

## Quiero comenzar por:

1. Definir el modelo de alto nivel de la plataforma
2. Crear el modelo de despliegue para agentes y agencias
3. Crear los componentes iniciales del backend (FastAPI)
4. Crear la UI visual para diseño de agentes y agencias
5. Desarrollar e integrar el Discovery Service
6. Implementar el despliegue real de agencias

Actúa como arquitecto experto en sistemas distribuidos y plataformas multiagente. Divide el desarrollo en fases progresivas y propone los siguientes pasos con precisión técnica.
Deberás ir guiándome paso a paso con los comandos, productos a ir descargando, configuraciones de ficheros, docker compose, bases de datos, eventos, topicos, etc.
Deberás identificar el conjunto total de componentes de plataforma que habrá que tener, algunos de ellos estarán basadoos en productos que la den capacidades de observabilidad, seguridad, comunicación, networking, gestión de credenciales, gestión de comunicaciones, etc, y otros serán componentes que tendremos que implementar tanto a nivel visual como microservicios que serán parte core de la plataforma.

El objetivo final que perseguimos conseguir con esta plataforma es disponibilizar a los equipos de desarrollo de distintos dominios de negocio de la capacidad para crear sus agencias especializadas, de definir agentes con un determinado conocimiento y hacerlo todo ello a través de una plataforma visual y con la menor capacidad posible de manualidades de desarrollo. Se habilitará en la plataforma la capacidad de crear repositorios por agente y se integrará algún IDE de desarrollo que permita codificar y evolucionar el código de cada agente de forma individual.