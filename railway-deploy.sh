#!/bin/bash

# Railway deployment script
PROJECT_ID="39d5c492-0cd4-4741-919b-421d5c79a726"
RAILWAY_TOKEN="9eddbdad-831b-4114-a982-2150eab765aa"

echo "🚀 Starting Railway deployment..."
echo "Project ID: $PROJECT_ID"

# Create a simple railway.json for configuration
cat > railway.json << 'RAILWAY_CONFIG'
{
  "name": "cheap-car-insurance-pa",
  "build": {
    "builder": "dockerfile"
  },
  "deploy": {
    "startCommand": "node dist/server/_core/index.js",
    "restartPolicy": "on-failure"
  }
}
RAILWAY_CONFIG

echo "✅ Created railway.json"
echo "📝 Next steps:"
echo "1. Go to https://railway.com/project/$PROJECT_ID"
echo "2. Click 'Add a Service' > 'Empty Service'"
echo "3. Configure the service with your Dockerfile"
echo "4. Set environment variables"
echo "5. Deploy!"
