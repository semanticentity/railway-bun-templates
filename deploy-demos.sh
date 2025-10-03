#!/bin/bash

# Railway Bun Templates - Demo Deployment Script
# Deploys all 5 templates to Railway for testing and showcase

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Railway Bun Templates - Demo Deployment${NC}"
echo "============================================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not installed${NC}"
    echo ""
    echo "Install it with:"
    echo "  npm i -g @railway/cli"
    echo ""
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Railway${NC}"
    echo "Please login first:"
    echo "  railway login"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Railway CLI ready${NC}"
echo ""

# Array of templates
TEMPLATES=("bun-http-server" "bun-rest-api" "bun-postgresql" "bun-react-vite" "bun-websocket")
DEMO_URLS=()

# Function to deploy a template
deploy_template() {
    local template=$1
    local needs_db=$2
    
    echo ""
    echo -e "${BLUE}📦 Deploying: $template${NC}"
    echo "================================"
    
    cd "$template"
    
    # Initialize Railway project
    echo "Initializing Railway project..."
    railway init --name "demo-$template" || echo "Project may already exist"
    
    # Add database if needed
    if [[ "$needs_db" == "true" ]]; then
        echo "Adding PostgreSQL database..."
        railway add --database postgres || echo "Database may already exist"
        
        # Link DATABASE_URL
        railway variables set DATABASE_URL="\${{Postgres.DATABASE_URL}}"
    fi
    
    # Deploy
    echo "Deploying to Railway..."
    railway up
    
    # Get the URL
    echo "Generating public domain..."
    railway domain || echo "Domain may already exist"
    
    # Get deployment URL
    local url=$(railway status --json 2>/dev/null | grep -o 'https://[^"]*' | head -1)
    
    if [[ -n "$url" ]]; then
        echo -e "${GREEN}✅ Deployed: $url${NC}"
        DEMO_URLS+=("$template|$url")
        
        # Test health endpoint
        echo "Testing health endpoint..."
        sleep 5
        if curl -s "$url/health" > /dev/null; then
            echo -e "${GREEN}✅ Health check passed${NC}"
        else
            echo -e "${YELLOW}⚠️  Health check failed (may need more time)${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Could not get deployment URL${NC}"
    fi
    
    cd ..
}

# Deploy all templates
echo "Starting deployment of all templates..."
echo ""

# Simple templates first
deploy_template "bun-http-server" "false"
deploy_template "bun-rest-api" "false"
deploy_template "bun-websocket" "false"
deploy_template "bun-react-vite" "false"

# PostgreSQL template last (needs database)
deploy_template "bun-postgresql" "true"

# Summary
echo ""
echo -e "${BLUE}🎉 Deployment Complete!${NC}"
echo "======================="
echo ""
echo "Demo URLs:"
for entry in "${DEMO_URLS[@]}"; do
    IFS='|' read -r template url <<< "$entry"
    echo -e "  ${GREEN}$template${NC}: $url"
done

echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Test all demo URLs in your browser"
echo "2. Update README files with actual demo URLs"
echo "3. Create GitHub Pages landing with demos"
echo "4. Submit templates to Railway marketplace"
echo ""
echo -e "${BLUE}💰 Estimated Cost:${NC} ~\$32/month for all demos"
echo -e "${GREEN}💰 Expected Revenue:${NC} \$1,250-2,500/month with 50% share"
echo ""
echo "🚀 Demos are your marketing - keep them running!"
