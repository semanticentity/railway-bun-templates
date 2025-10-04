#!/bin/bash

# Act Setup Script
# Install and configure Act for local GitHub Actions testing

echo "⚡ Setting up Act for local GitHub Actions"
echo "=========================================="

# Check if act is installed
if command -v act &> /dev/null; then
    echo "✅ Act already installed: $(act --version)"
else
    echo "📦 Installing Act..."
    if command -v brew &> /dev/null; then
        brew install act
    else
        echo "❌ Homebrew not found. Install manually:"
        echo "   https://github.com/nektos/act#installation"
        exit 1
    fi
fi

# Create .actrc config file
echo "⚙️  Creating Act configuration..."
cat > .actrc << 'EOF'
# Act configuration
# Use medium runner for better compatibility
-P ubuntu-latest=catthehacker/ubuntu:act-latest
EOF

# Create act secrets file (if needed)
if [ ! -f .secrets ]; then
    echo "🔐 Creating secrets template..."
    cat > .secrets << 'EOF'
# GitHub secrets for local testing
# Add any secrets your workflow needs
# GITHUB_TOKEN=your_token_here
EOF
fi

echo ""
echo "🎯 Act Commands:"
echo "  act                           # Run all workflows"
echo "  act -j build-and-deploy       # Run specific job"
echo "  act --list                    # List available workflows"
echo "  act --dry-run                 # Show what would run"
echo "  act -v                        # Verbose output"
echo ""

# Test act installation
echo "🧪 Testing Act installation..."
if act --list &> /dev/null; then
    echo "✅ Act working correctly!"
    echo ""
    echo "📋 Available workflows:"
    act --list
else
    echo "❌ Act test failed"
    exit 1
fi

echo ""
echo "🚀 Ready! Run './test-workflow.sh' to test your deployment locally"
