#!/bin/bash
echo "🗄️ Resetting PATSON database..."

# Drop and recreate database
docker compose -f docker/docker-compose.yml exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS petsons;"
docker compose -f docker/docker-compose.yml exec postgres psql -U postgres -c "CREATE DATABASE petsons;"

# Run migrations
pnpm db:migrate

# Seed
pnpm db:seed

echo "✅ Database reset complete!"
