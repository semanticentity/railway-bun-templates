# Bun HTTP Server

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/YOUR-CODE)
[![Tests](https://github.com/semanticentity/railway-bun-templates/workflows/Tests/badge.svg)](https://github.com/semanticentity/railway-bun-templates/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**The fastest way to build HTTP APIs on Railway.** Lightning-fast HTTP server built with Bun, delivering **3-6x better performance** than Node.js with zero configuration required.

Perfect for REST APIs, webhooks, microservices, and any backend that needs blazing speed.

## One-Click Deploy

Deploys in under 60 seconds with automatic HTTPS, health checks, and zero config.

## Why Bun?

- **3-6x faster** than Node.js
- **3x faster** than Flask/Django
- **Native TypeScript** - no transpilation needed
- **Built-in hot reload** for instant development
- **20x faster** npm install
- **Production-ready** performance out of the box

## Features

- **Health check endpoint** - Railway-optimized monitoring
- **Hot reload** - instant updates during development
- **Error handling** - robust error responses
- **TypeScript** - full type safety
- **ES modules** - modern JavaScript
- **Zero dependencies** - minimal attack surface

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Production
bun run start
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info and available endpoints |
| `/health` | GET | Health check for Railway monitoring |
| `/hello/:name` | GET | Example parameterized route |

## Perfect For

- **REST APIs** - Build blazing-fast API backends
- **Webhooks** - Handle webhook events at scale
- **Microservices** - Lightweight, fast microservices
- **Backend Services** - Any HTTP backend workload
- **API Gateways** - High-performance routing
- **SaaS Backends** - Production-ready infrastructure

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port (Railway sets this automatically) |

No other configuration needed! Railway handles everything automatically.

## Performance Comparison

```
Requests/second (higher is better):
Bun:       45,000 req/s  ███████████████████████ 
Node.js:   15,000 req/s  ███████
Flask:     12,000 req/s  ██████
```

**Real-world performance:** 3-6x faster than Node.js, 3x faster than Python frameworks.

## Local Development

```bash
# Clone or create new project
git clone YOUR-REPO

# Install Bun (if needed)
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Start with hot reload
bun run dev

# Server runs at http://localhost:3000
# Try http://localhost:3000/health
```

## Deploy to Railway

### Option 1: One-Click (Recommended)
Click the deploy button above and Railway handles everything!

### Option 2: Manual Deploy
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

## Extending This Template

```typescript
// src/index.ts
const server = Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    
    // Add your own routes
    if (url.pathname === '/api/users') {
      return new Response(JSON.stringify({ users: [] }));
    }
    
    // ... existing routes
  }
});
```

## Support & Community

- [Railway Documentation](https://docs.railway.com)
- [Railway Discord](https://discord.gg/railway)
- [Report Issues](https://github.com/semanticentity/railway-bun-templates/issues)
- Star this repo if you find it useful

## License

MIT - use freely in personal and commercial projects.

---

**Built by semanticentity** | First Bun templates on Railway marketplace
