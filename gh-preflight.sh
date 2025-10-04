#!/bin/bash

# GitHub CLI Preflight Script
# Test workflows and deployments before pushing

echo "🔍 GitHub Pages Preflight Check"
echo "================================"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not installed"
    echo "📦 Install: brew install gh"
    exit 1
fi

# Check if logged in
if ! gh auth status &> /dev/null; then
    echo "🔐 Not logged in to GitHub"
    echo "🚪 Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI ready"
echo ""

# Show current workflow status
echo "📊 Current Workflow Status:"
gh run list --workflow=deploy.yml --limit=3

echo ""
echo "🛠️ Available Commands:"
echo "  gh workflow run deploy.yml     # Trigger deploy manually"
echo "  gh run watch                   # Watch latest run live"
echo "  gh run list                    # List recent runs"
echo "  gh workflow view deploy.yml    # View workflow file"
echo ""

# Ask if user wants to trigger a test run
read -p "🚀 Trigger test deployment? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Triggering deployment..."
    gh workflow run deploy.yml
    echo "⏱️  Watching deployment..."
    sleep 2
    gh run watch
else
    echo "👍 Skipping deployment"
fi
