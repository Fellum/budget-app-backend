DEV_COMPOSE_FILE=compose.dev.yaml
PROD_COMPOSE_FILE=compose.yaml

dev-build:
	docker compose -f $(DEV_COMPOSE_FILE) build
dev-up:
	docker compose -f $(DEV_COMPOSE_FILE) up
dev-down:
	docker compose -f $(DEV_COMPOSE_FILE) down
dev-restart: dev-down dev-build dev-up


prod-volume-create:
	docker volume create budgetAppRedis
	docker volume create budgetAppPostgres
prod-volume-delete:
	docker volume rm budgetAppRedis
	docker volume rm budgetAppPostgres
prod-volume-recreate: prod-volume-delete prod-volume-create

prod-build:
	docker compose -f $(PROD_COMPOSE_FILE) build
prod-up: prod-build prod-volume-create
	docker compose -f $(PROD_COMPOSE_FILE) up
prod-down: prod-volume-delete
	docker compose -f $(PROD_COMPOSE_FILE) down
prod-restart: prod-down prod-up