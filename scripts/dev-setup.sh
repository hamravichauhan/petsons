#!/bin/bash
echo "🚀 Setting up PATSON development environment..."

# Start Docker services
echo "📦 Starting Docker services..."
docker compose -f docker/docker-compose.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Install dependencies
echo "📥 Installing dependencies..."
pnpm install

# Run database migrations
echo "🗄️ Running database migrations..."
pnpm db:migrate

# Seed database
echo "🌱 Seeding database..."
pnpm db:seed

echo "✅ PATSON development environment is ready!"
echo ""
echo "Services:"
echo "  Frontend:  http://localhost:3000"
echo "  Admin:     http://localhost:3001"
echo "  API:       http://localhost:3002"
echo "  PostgreSQL: localhost:5432"
echo "  Redis:      localhost:6379"
echo "  Kafka:      localhost:9092"
EOF

