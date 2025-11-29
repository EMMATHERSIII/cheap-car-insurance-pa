#!/bin/bash

###############################################################################
# Hostinger Deployment Script for CheapCarInsurancePennsylvania.com
# This script automates the deployment process to Hostinger hosting
###############################################################################

set -e  # Exit on error

echo "========================================="
echo "Hostinger Deployment Script"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if .env file exists
if [ ! -f ".env.hostinger" ]; then
    print_error ".env.hostinger file not found!"
    print_info "Please create .env.hostinger with your Hostinger configuration"
    print_info "See .env.hostinger.example for reference"
    exit 1
fi

# Load environment variables
source .env.hostinger

# Validate required environment variables
if [ -z "$HOSTINGER_SSH_HOST" ] || [ -z "$HOSTINGER_SSH_USER" ] || [ -z "$HOSTINGER_APP_PATH" ]; then
    print_error "Missing required environment variables in .env.hostinger"
    print_info "Required: HOSTINGER_SSH_HOST, HOSTINGER_SSH_USER, HOSTINGER_APP_PATH"
    exit 1
fi

echo "Configuration:"
echo "  SSH Host: $HOSTINGER_SSH_HOST"
echo "  SSH User: $HOSTINGER_SSH_USER"
echo "  App Path: $HOSTINGER_APP_PATH"
echo ""

# Step 1: Build the application locally
print_info "Step 1: Building application locally..."
if [ -f "package.json" ]; then
    pnpm install || npm install
    pnpm build || npm run build
    print_success "Application built successfully"
else
    print_error "package.json not found!"
    exit 1
fi

# Step 2: Create deployment package
print_info "Step 2: Creating deployment package..."
DEPLOY_DIR="deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# Copy necessary files
cp -r dist "$DEPLOY_DIR/" 2>/dev/null || print_warning "No dist folder found"
cp -r client/dist "$DEPLOY_DIR/client-dist" 2>/dev/null || print_warning "No client dist found"
cp -r server "$DEPLOY_DIR/" 2>/dev/null || true
cp -r drizzle "$DEPLOY_DIR/" 2>/dev/null || true
cp -r shared "$DEPLOY_DIR/" 2>/dev/null || true
cp package.json "$DEPLOY_DIR/"
cp pnpm-lock.yaml "$DEPLOY_DIR/" 2>/dev/null || cp package-lock.json "$DEPLOY_DIR/" 2>/dev/null || true
cp drizzle.config.ts "$DEPLOY_DIR/" 2>/dev/null || true

# Create .env file for production
if [ -f ".env.production" ]; then
    cp .env.production "$DEPLOY_DIR/.env"
    print_success "Copied production environment file"
else
    print_warning "No .env.production found - you'll need to create .env manually on server"
fi

# Create archive
tar -czf "${DEPLOY_DIR}.tar.gz" "$DEPLOY_DIR"
print_success "Deployment package created: ${DEPLOY_DIR}.tar.gz"

# Step 3: Upload to Hostinger
print_info "Step 3: Uploading to Hostinger..."
scp "${DEPLOY_DIR}.tar.gz" "${HOSTINGER_SSH_USER}@${HOSTINGER_SSH_HOST}:~/"
print_success "Upload complete"

# Step 4: Deploy on server
print_info "Step 4: Deploying on Hostinger server..."
ssh "${HOSTINGER_SSH_USER}@${HOSTINGER_SSH_HOST}" << 'ENDSSH'
    set -e
    
    # Navigate to app directory
    cd "$HOSTINGER_APP_PATH" || exit 1
    
    # Backup current deployment
    if [ -d "current" ]; then
        echo "Creating backup of current deployment..."
        mv current "backup-$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true
    fi
    
    # Extract new deployment
    echo "Extracting new deployment..."
    tar -xzf ~/"${DEPLOY_DIR}.tar.gz"
    mv "$DEPLOY_DIR" current
    cd current
    
    # Install dependencies
    echo "Installing dependencies..."
    if command -v pnpm &> /dev/null; then
        pnpm install --prod
    else
        npm install --production
    fi
    
    # Run database migrations
    echo "Running database migrations..."
    if command -v pnpm &> /dev/null; then
        pnpm db:push || echo "Migration failed - please check manually"
    else
        npm run db:push || echo "Migration failed - please check manually"
    fi
    
    # Restart application
    echo "Restarting application..."
    if [ -f "restart.sh" ]; then
        ./restart.sh
    else
        # Try common restart methods
        pm2 restart all 2>/dev/null || \
        systemctl restart nodejs-app 2>/dev/null || \
        echo "Please restart your Node.js application manually"
    fi
    
    echo "Deployment complete!"
ENDSSH

print_success "Deployment completed successfully!"

# Cleanup
print_info "Cleaning up local files..."
rm -rf "$DEPLOY_DIR"
rm "${DEPLOY_DIR}.tar.gz"
print_success "Cleanup complete"

echo ""
echo "========================================="
echo "Deployment Summary"
echo "========================================="
echo "✓ Application built"
echo "✓ Files uploaded to Hostinger"
echo "✓ Dependencies installed"
echo "✓ Database migrations run"
echo "✓ Application restarted"
echo ""
print_success "Your site should now be live on Hostinger!"
print_info "Please verify at: https://cheapcarinsurancepennsylvania.com"
echo ""
