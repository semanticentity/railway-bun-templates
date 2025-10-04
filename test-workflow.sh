#!/bin/bash

# Test GitHub Actions Workflow Locally with Act

echo "🧪 Testing GitHub Actions Workflow Locally"
echo "=========================================="

# Check if act is available
if ! command -v act &> /dev/null; then
    echo "❌ Act not installed. Run ./setup-act.sh first"
    exit 1
fi

echo "🔍 Available workflows:"
act --list
echo ""

# Test the deploy workflow
echo "🚀 Testing deploy workflow..."
echo "⚠️  Note: This will simulate the workflow but won't actually deploy"
echo ""

# Run with dry-run first
echo "📋 Dry run (shows what would happen):"
act -j build-and-deploy --dry-run

echo ""
read -p "🚀 Run actual test? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "⚡ Running workflow locally..."
    act -j build-and-deploy -v
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Workflow test passed!"
        echo "🎯 Your GitHub Actions should work when pushed"
    else
        echo ""
        echo "❌ Workflow test failed"
        echo "🔧 Fix issues before pushing to GitHub"
    fi
else
    echo "👍 Skipping actual test"
fi
