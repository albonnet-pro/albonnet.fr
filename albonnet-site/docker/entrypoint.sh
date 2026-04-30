#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npx prisma@5 db push --accept-data-loss --skip-generate

echo "🌱 Seeding database..."
npx prisma@5 db seed

echo "🚀 Starting Albonnet..."
exec "$@"
