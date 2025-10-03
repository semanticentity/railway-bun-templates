# Bun REST API

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/semanticentity/railway-bun-templates/tree/main/bun-rest-api)
[![Tests](https://github.com/semanticentity/railway-bun-templates/workflows/Tests/badge.svg)](https://github.com/semanticentity/railway-bun-templates/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Complete REST API with CRUD operations built with Bun.** Production-ready API server delivering **3-6x better performance** than Node.js with comprehensive features out of the box.

Perfect for backend APIs, SaaS platforms, mobile app backends, and any application requiring a robust REST API.

## Features

- **Full CRUD operations** - Complete create, read, update, delete functionality
- **Pagination support** - Efficient data pagination for large datasets
- **Request validation** - Input validation and sanitization
- **Rate limiting** - Protect against abuse and DoS attacks
- **CORS enabled** - Cross-origin resource sharing configured
- **Security headers** - Production security best practices
- **3-6x faster** than Node.js - Native Bun performance

## Quick Start

```bash
bun install
bun run dev
```

## API Endpoints

- `GET /api/items?page=1&limit=10` - List items (paginated)
- `POST /api/items` - Create item
- `GET /api/items/:id` - Get item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

## Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/semanticentity/railway-bun-templates/tree/main/bun-rest-api)

## Use Cases

- SaaS backends
- Mobile app APIs
- E-commerce APIs
- Content management

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port (Railway sets this automatically) |

## Local Development

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Start development server with hot reload
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

## Support & Community

- [Railway Documentation](https://docs.railway.com)
- [Bun Documentation](https://bun.sh/docs)
- [Report Issues](https://github.com/semanticentity/railway-bun-templates/issues)
- Star this repo if you find it useful

## License

MIT - use freely in personal and commercial projects.

---

**Built by semanticentity**
