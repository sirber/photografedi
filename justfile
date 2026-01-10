_help:
    @just --list

# Start development environment
[group('docker')]
dev: down
    @docker compose up --build -d --wait

# Stop development environment
[group('docker')]
down:
    @docker compose down

# Get a shell in the backend container
[group('app')]
cli-back:
    @docker compose exec backend bash

# Get a shell in the frontend container
[group('app')]
cli-front:
    @docker compose exec frontend bash

# Run Prettier across frontend and backend
[group('app')]
prettier:
    @cd backend && (bunx prettier --write 'src/**/*.{ts,js,json,md}')
    @cd frontend && (bunx prettier --write 'src/**/*.{ts,js,json,md,css,html}')

# Run ESLint across frontend and backend (uses local tsconfig in each package)
[group('app')]
eslint:
    @cd backend && bunx eslint 'src/**/*.{ts,js}' --fix || true
    @cd frontend && bunx eslint 'src/**/*.{ts,js,tsx}' --fix || true

# Run TypeScript type checking across frontend and backend
[group('app')]
type-check:
    @cd backend && bunx tsc --noEmit
    @cd frontend && bunx tsc --noEmit

# Runs all quality tools (linter, formatter, type checker)
[group('app')]
quality: prettier eslint type-check

# Generate migrations/artifacts from the current schema
[group('database')]
drizzle-generate:
    @cd backend && bunx drizzle-kit generate

# Apply pending migrations to the configured database
[group('database')]
drizzle-migrate:
    @cd backend && bunx drizzle-kit migrate

# Push the current schema state directly to the database
[group('database')]
drizzle-push:
    @cd backend && bunx drizzle-kit push
