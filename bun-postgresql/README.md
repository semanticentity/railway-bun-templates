# Bun PostgreSQL

Bun API with PostgreSQL database integration.

## Features

- 🗄️ PostgreSQL database included
- 🔄 Database migrations
- 🏊 Connection pooling
- ✅ CRUD operations
- 📝 TypeScript support

## Quick Start

```bash
bun install
bun run dev
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection (auto-set by Railway)
- `PORT` - Server port (default: 3000)

## Database Schema

Includes example users table with migrations.

## API Endpoints

- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/YOUR-CODE)

Database automatically configured by Railway.

## Use Cases

- User management
- CMS backends
- Data-driven apps
- SaaS platforms

## License

MIT
