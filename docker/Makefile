COMPOSE = docker compose -f docker-compose.platform.yml -f docker-compose.services.yml -f docker-compose.agents.yml

.PHONY: up down build logs restart ps \
        up-platform up-services up-agents \
        build-platform build-services build-agents

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

build:
	$(COMPOSE) build

logs:
	$(COMPOSE) logs -f

restart:
	$(COMPOSE) down && $(COMPOSE) up -d --build

ps:
	$(COMPOSE) ps

# Acciones por grupo
up-platform:
	docker compose -f docker-compose.platform.yml up -d

up-services:
	docker compose -f docker-compose.services.yml up -d

up-agents:
	docker compose -f docker-compose.agents.yml up -d

build-platform:
	docker compose -f docker-compose.platform.yml build

build-services:
	docker compose \
		-f docker-compose.platform.yml \
		-f docker-compose.services.yml \
		build

build-agents:
	docker compose -f docker-compose.agents.yml build
