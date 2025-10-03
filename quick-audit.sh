#!/bin/bash

# Quick Template Audit for Railway Marketplace Readiness
echo "🚀 Railway Bun Templates - Quick Audit"
echo "======================================"

TEMPLATES=("bun-http-server" "bun-rest-api" "bun-postgresql" "bun-react-vite" "bun-websocket")

for template in "${TEMPLATES[@]}"; do
    echo ""
    echo "🔍 Auditing: $template"
    echo "========================"
    
    if [[ ! -d "$template" ]]; then
        echo "❌ Template directory not found"
        continue
    fi
    
    # Check essential files
    echo "📁 File Check:"
    [[ -f "$template/package.json" ]] && echo "  ✅ package.json" || echo "  ❌ package.json"
    [[ -f "$template/railway.json" ]] && echo "  ✅ railway.json" || echo "  ❌ railway.json"
    [[ -f "$template/README.md" ]] && echo "  ✅ README.md" || echo "  ❌ README.md"
    [[ -f "$template/.gitignore" ]] && echo "  ✅ .gitignore" || echo "  ❌ .gitignore"
    
    # Check package.json content
    if [[ -f "$template/package.json" ]]; then
        echo "📦 Package.json Check:"
        grep -q '"start"' "$template/package.json" && echo "  ✅ start script" || echo "  ❌ start script"
        grep -q '"dev"' "$template/package.json" && echo "  ✅ dev script" || echo "  ❌ dev script"
        grep -q '"type": "module"' "$template/package.json" && echo "  ✅ ES modules" || echo "  ⚠️  CommonJS"
    fi
    
    # Check railway.json
    if [[ -f "$template/railway.json" ]]; then
        echo "🚂 Railway Config:"
        grep -q '"RAILPACK"' "$template/railway.json" && echo "  ✅ RAILPACK builder" || echo "  ⚠️  Default builder"
    fi
    
    # Check README content
    if [[ -f "$template/README.md" ]]; then
        echo "📚 README Check:"
        grep -qi "railway" "$template/README.md" && echo "  ✅ Railway mentioned" || echo "  ❌ No Railway info"
        grep -qi "deploy" "$template/README.md" && echo "  ✅ Deploy instructions" || echo "  ❌ No deploy info"
        local word_count=$(wc -w < "$template/README.md")
        [[ $word_count -gt 100 ]] && echo "  ✅ Detailed ($word_count words)" || echo "  ⚠️  Brief ($word_count words)"
    fi
    
    # Check source code
    if [[ -d "$template/src" ]]; then
        echo "💻 Code Check:"
        grep -r "health\|ping" "$template/src" >/dev/null && echo "  ✅ Health endpoint" || echo "  ❌ No health endpoint"
        grep -r "process\.env\|Bun\.env" "$template/src" >/dev/null && echo "  ✅ Environment vars" || echo "  ❌ No env vars"
        grep -r "error\|catch" "$template/src" >/dev/null && echo "  ✅ Error handling" || echo "  ❌ No error handling"
    fi
done

echo ""
echo "🎯 MARKETPLACE READINESS SUMMARY"
echo "================================"
echo "✅ = Ready  ⚠️ = Needs attention  ❌ = Must fix"
echo ""
echo "💡 Priority fixes for marketplace success:"
echo "1. Add health check endpoints to all templates"
echo "2. Ensure all READMEs have Railway deploy instructions"
echo "3. Use RAILPACK builder in railway.json"
echo "4. Add comprehensive error handling"
echo "5. Document environment variables"
