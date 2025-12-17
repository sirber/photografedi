_help:
    @just --list

# Start development environment
dev: down
    @docker compose up --build -d --wait

# Stop development environment
down:
    @docker compose down

# Get a shell in the backend container
cli-back:
    @docker compose exec backend bash

# Get a shell in the frontend container
cli-front:
    @docker compose exec frontend bash

