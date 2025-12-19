#!/bin/bash

# Railway deployment script
PROJECT_ID="39d5c492-0cd4-4741-919b-421d5c79a726"
RAILWAY_TOKEN="$1"

if [ -z "$RAILWAY_TOKEN" ]; then
  echo "Usage: ./railway-deploy.sh <railway-token>"
  exit 1
fi

echo "🚀 Starting Railway deployment..."
echo "Project ID: $PROJECT_ID"

# Create a simple Node.js app that serves the built files
echo "📦 Building production bundle..."
pnpm build

echo "✅ Build complete!"
echo "📝 Next steps:"
echo "1. Go to https://railway.com/project/$PROJECT_ID"
echo "2. Add a new service and select 'Docker Image'"
echo "3. Or use: railway up --service cheap-car-insurance-pa"

