# Bun Templates for Railway

[![Tests](https://github.com/semanticentity/railway-bun-templates/workflows/Tests/badge.svg)](https://github.com/semanticentity/railway-bun-templates/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-1.2+-black?logo=bun)](https://bun.sh)
[![Railway](https://img.shields.io/badge/Railway-Deploy-purple?logo=railway)](https://railway.app)

Production-ready Bun templates for Railway deployment. First comprehensive Bun template collection on Railway marketplace.

## Why Bun?

- **3-6x faster** than Node.js
- **3x faster** than Flask/Django  
- Built-in TypeScript support
- Native ESM and CommonJS
- Production-ready performance

## Templates

### Bun HTTP Server

Fast HTTP server for APIs and webhooks.

**Features:**
- Health check endpoint
- TypeScript support
- Hot reload in development
- Production optimized

**Deploy:** [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/semanticentity/railway-bun-templates/tree/main/bun-http-server)

**Use cases:** REST APIs, webhooks, microservices

---

### Bun REST API

Full-featured REST API with CRUD operations.

**Features:**
- CRUD operations
- Pagination support
- Request validation
- Rate limiting
- CORS enabled
- Security headers

**Deploy:** [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/semanticentity/railway-bun-templates/tree/main/bun-rest-api)

**Use cases:** Backend APIs, SaaS backends, mobile app backends

---

### Bun PostgreSQL

Bun API with PostgreSQL database integration.

**Features:**
- PostgreSQL database included
- Database migrations
- Connection pooling
- CRUD API endpoints
- Environment variable management

**Deploy:** [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/semanticentity/railway-bun-templates/tree/main/bun-postgresql)

**Use cases:** User management, data-driven apps, CMS backends

---

### Bun React Vite

Modern React frontend with Vite and Bun.

**Features:**
- React 18
- Vite for fast builds
- TypeScript support
- Responsive design
- Production optimized

**Deploy:** [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/semanticentity/railway-bun-templates/tree/main/bun-react-vite)

**Use cases:** SPAs, dashboards, admin panels, landing pages

---

### Bun WebSocket

Real-time WebSocket server.

**Features:**
- WebSocket support
- User management
- Chat functionality
- Rate limiting
- Test client included

**Deploy:** [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/semanticentity/railway-bun-templates/tree/main/bun-websocket)

**Use cases:** Chat apps, real-time dashboards, live updates, collaborative tools

---

## Performance Comparison

| Runtime | Speed | TypeScript | Build Time |
|---------|-------|------------|------------|
| **Bun** | **3-6x** | Native | **Fast** |
| Node.js | 1x | Requires setup | Slow |
| Deno | 2x | Native | Medium |
| Python | 0.3x | No | N/A |

## Quick Start

### Deploy via Railway

Click any "Deploy" button above for one-click deployment.

### Deploy via CLI

```bash
# Clone template
git clone https://github.com/semanticentity/railway-bun-templates.git
cd railway-bun-templates/bun-http-server

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Run locally
bun run dev

# Deploy to Railway
railway up
```

## Environment Variables

All templates support Railway's automatic environment variables:

- `PORT` - Set automatically by Railway
- `DATABASE_URL` - PostgreSQL connection (for bun-postgresql)
- `NODE_ENV` - production/development

## Local Development

```bash
# Start development server
bun run dev

# Run tests
bun test

# Build for production
bun run build

# Start production server
bun run start
```

## Template Details

### Bun HTTP Server
- **Complexity:** Beginner
- **Services:** 1
- **Database:** None
- **Estimated cost:** $5/month

### Bun REST API
- **Complexity:** Intermediate
- **Services:** 1
- **Database:** None
- **Estimated cost:** $5/month

### Bun PostgreSQL
- **Complexity:** Intermediate
- **Services:** 2 (API + Database)
- **Database:** PostgreSQL
- **Estimated cost:** $12/month

### Bun React Vite
- **Complexity:** Beginner
- **Services:** 1
- **Database:** None
- **Estimated cost:** $5/month

### Bun WebSocket
- **Complexity:** Intermediate
- **Services:** 1
- **Database:** None
- **Estimated cost:** $5/month

## Technology Stack

- **Runtime:** Bun 1.2+
- **Language:** TypeScript 5+
- **Framework:** Native Bun APIs
- **Database:** PostgreSQL (bun-postgresql only)
- **Frontend:** React 18 + Vite (bun-react-vite only)

## Documentation

Each template includes:
- Detailed README
- Example code and comments
- Health check endpoints
- Error handling
- Production best practices
- Environment variable documentation

## Testing

All templates are continuously tested via GitHub Actions:
- Structure validation
- Package.json validation
- Railway.json validation
- Health endpoint checks
- Documentation validation

See the [Tests badge](https://github.com/semanticentity/railway-bun-templates/actions) for current status.

## Support

- **Issues:** [GitHub Issues](https://github.com/semanticentity/railway-bun-templates/issues)
- **Railway Docs:** https://docs.railway.com
- **Bun Docs:** https://bun.sh/docs

## Contributing

Contributions welcome! Please open an issue or pull request.

## License

MIT License - use freely in personal and commercial projects.

---

**First comprehensive Bun template collection on Railway marketplace**

Built by [semanticentity](https://github.com/semanticentity)
