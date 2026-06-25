# PATSON B2B Wholesale Marketplace

**Domain:** Concentrated Beverages, Jams, Syrups & Food Service Products

## Architecture

- **Monorepo:** Turborepo with pnpm workspaces
- **Frontend:** Next.js 15 (Retailer Portal)
- **Admin:** Payload CMS 3 (Internal Admin Panel)
- **Backend:** NestJS 11 (Microservices)
- **Database:** PostgreSQL 17
- **Cache:** Redis 7
- **Message Broker:** Apache Kafka
- **Search:** OpenSearch 2.x

## Project Structure

petsons/
├── apps/
│ ├── frontend/ # Next.js Retailer Portal (port 3000)
│ ├── admin/ # Payload CMS Admin Panel (port 3001)
│ └── api/ # NestJS Backend API (port 3002)
├── packages/
│ ├── types/ # Shared TypeScript types
│ ├── utils/ # Shared utilities
│ ├── ui/ # Shared UI components
│ ├── config/ # Shared configuration
│ └── kafka-events/ # Kafka event definitions
├── docker/ # Docker Compose for local development
├── scripts/ # Utility scripts
├── terraform/ # Infrastructure as Code
└── .github/workflows/ # CI/CD pipelines

text

## Quick Start

````bash
# 1. Start infrastructure
pnpm docker:up

# 2. Install dependencies
pnpm install

# 3. Start development
pnpm dev
Available Commands
Command	Description
pnpm dev	Start all apps in development mode
pnpm build	Build all apps and packages
pnpm test	Run all tests
pnpm lint	Lint all code
pnpm type-check	TypeScript type checking
pnpm docker:up	Start PostgreSQL, Redis, Kafka
pnpm docker:down	Stop Docker services
Environment Variables
Copy .env.example to .env and fill in the values.

License
Private - All Rights Reserved
EOF

text

---

## STEP 9: INSTALL AND VERIFY

```bash
# Install all dependencies
pnpm install

# Verify structure
echo "=== Directory Structure ==="
find . -maxdepth 3 -type d -not -path './node_modules/*' -not -path './.git/*' -not -path './.turbo/*' | sort

echo ""
echo "=== Root Files ==="
ls -la | grep -v "^d" | grep -v "^total"

echo ""
echo "=== Apps ==="
ls apps/

echo ""
echo "=== Packages ==="
ls packages/
````
