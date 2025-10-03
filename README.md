# Bun Templates for Railway

Production-ready Bun templates for Railway deployment. First Bun templates on Railway marketplace.

## Why Bun?

- ⚡ **3-6x faster** than Node.js
- 🔥 **3x faster** than Flask/Django  
- ✅ Built-in TypeScript support
- 🚀 Native ESM and CommonJS
- 💪 Production-ready performance

## Templates

### 🚀 Bun HTTP Server

Fast HTTP server for APIs and webhooks.

**Features:**
- Health check endpoint
- TypeScript support
- Hot reload in development
- Production optimized

**Deploy:** [Railway Deploy Button]

**Use cases:** REST APIs, webhooks, microservices

---

### 🔧 Bun REST API

Full-featured REST API with CRUD operations.

**Features:**
- CRUD operations
- Pagination support
- Request validation
- Rate limiting
- CORS enabled
- Security headers

**Deploy:** [Railway Deploy Button]

**Use cases:** Backend APIs, SaaS backends, mobile app backends

---

### 🗄️ Bun PostgreSQL

Bun API with PostgreSQL database integration.

**Features:**
- PostgreSQL database included
- Database migrations
- Connection pooling
- CRUD API endpoints
- Environment variable management

**Deploy:** [Railway Deploy Button]

**Use cases:** User management, data-driven apps, CMS backends

---

### ⚛️ Bun React Vite

Modern React frontend with Vite and Bun.

**Features:**
- React 18
- Vite for fast builds
- TypeScript support
- Responsive design
- Production optimized

**Deploy:** [Railway Deploy Button]

**Use cases:** SPAs, dashboards, admin panels, landing pages

---

### 💬 Bun WebSocket

Real-time WebSocket server.

**Features:**
- WebSocket support
- User management
- Chat functionality
- Rate limiting
- Test client included

**Deploy:** [Railway Deploy Button]

**Use cases:** Chat apps, real-time dashboards, live updates, collaborative tools

---

## Performance Comparison

| Runtime | Speed | TypeScript | Build Time |
|---------|-------|------------|------------|
| **Bun** | **3-6x** | ✅ Native | **Fast** |
| Node.js | 1x | ❌ Requires setup | Slow |
| Deno | 2x | ✅ Native | Medium |
| Python | 0.3x | ❌ No | N/A |

## Quick Start

### Deploy via Railway

Click any "Deploy" button above for one-click deployment.

### Deploy via CLI

```bash
# Clone template
git clone https://github.com/YOUR-USERNAME/railway-bun-templates.git
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
- ✅ Detailed README
- ✅ Example code and comments
- ✅ Health check endpoints
- ✅ Error handling
- ✅ Production best practices
- ✅ Environment variable documentation

## Support

- **Issues:** [GitHub Issues]
- **Discussions:** [GitHub Discussions]
- **Railway Docs:** https://docs.railway.com

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md] for guidelines.

## License

MIT License - use freely in personal and commercial projects.

## Keywords

bun, railway, templates, typescript, api, rest, postgresql, websocket, react, vite, fast, performance, backend, frontend, deployment, production

---

**⭐ Star this repo if you find it useful!**

**First Bun templates on Railway marketplace** | Built with ⚡ by [Your Name]
