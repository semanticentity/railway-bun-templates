#!/bin/bash

# GitHub Pages Local Testing Script
# Serves docs/ directory exactly like GitHub Pages

echo "🚀 Starting local GitHub Pages server..."
echo "📁 Serving: docs/"
echo "🌐 URL: http://localhost:8000"
echo "📝 Press Ctrl+C to stop"
echo ""

# Check if python3 is available (most reliable)
if command -v python3 &> /dev/null; then
    echo "🐍 Using Python3"
    python3 -m http.server 8000 --directory docs
# Check if python3 is available
elif command -v python3 &> /dev/null; then
    echo "🐍 Using Python3"
    python3 -m http.server 8000 --directory docs
# Fallback to python
elif command -v python &> /dev/null; then
    echo "🐍 Using Python"
    cd docs && python -m http.server 8000
# Last resort - npx
else
    echo "📦 Using npx serve"
    npx serve docs -p 8000
fi
