# Bun + PostgreSQL 🗄️⚡

**Full-stack API with PostgreSQL, ready in 60 seconds.** Lightning-fast Bun server with production-grade PostgreSQL database, delivering **3-6x better performance** than Node.js with zero configuration.

Perfect for user management systems, CMS backends, SaaS platforms, and any data-driven application.

## 🚀 One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/YOUR-CODE)

**Includes:** Bun API + PostgreSQL database + automatic migrations + connection pooling

## ⚡ Why This Stack?

- **3-6x faster** than Node.js + PostgreSQL
- **Zero config** - Database automatically connected
- **Auto migrations** - Schema managed for you
- **Connection pooling** - Production-ready from day one
- **Native TypeScript** - Full type safety
- **Railway optimized** - Health checks built-in

## ✨ Features

- 🗄️ **PostgreSQL included** - Automatic provisioning on Railway
- 🔄 **Database migrations** - Version-controlled schema changes
- 🏊 **Connection pooling** - Efficient database connections
- ✅ **Full CRUD API** - Complete user management example
- 🛡️ **Error handling** - Robust database error management
- 🏥 **Health checks** - Database connectivity monitoring
- 📝 **TypeScript** - End-to-end type safety
- 🚀 **ES modules** - Modern JavaScript

## 📋 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check with database connectivity |
| `/users` | GET | List all users (with pagination) |
| `/users` | POST | Create new user |
| `/users/:id` | GET | Get user by ID |
| `/users/:id` | PUT | Update user |
| `/users/:id` | DELETE | Delete user |
| `/posts` | GET | List all posts with author info |
| `/posts` | POST | Create new post |

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table  
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Migrations run automatically on deployment!

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development (uses local DATABASE_URL)
bun run dev

# Run migrations
bun run db:migrate

# Seed example data
bun run db:seed
```

## 🔧 Environment Variables

| Variable | Description | Auto-Set by Railway |
|----------|-------------|---------------------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `PORT` | Server port | ✅ Yes |

**Railway automatically:**
- Creates PostgreSQL database
- Sets DATABASE_URL
- Runs migrations on deploy
- Configures connection pooling

## 🎯 Perfect For

- **User Management** - Authentication and user data
- **CMS Backends** - Content management systems
- **SaaS Platforms** - Multi-tenant applications
- **Data-Driven Apps** - Any app needing a database
- **E-commerce** - Product catalogs and orders
- **Analytics Dashboards** - Data storage and retrieval

## 🛠️ Local Development

```bash
# 1. Install Bun
curl -fsSL https://bun.sh/install | bash

# 2. Create local .env file
cp .env.example .env

# 3. Add your local PostgreSQL URL
echo "DATABASE_URL=postgresql://user:pass@localhost:5432/dbname" > .env

# 4. Install dependencies
bun install

# 5. Run migrations
bun run db:migrate

# 6. Start server
bun run dev

# Server at http://localhost:3000
# Try http://localhost:3000/health
```

## 📊 Database Operations

```typescript
// Example: Query users
const users = await sql`SELECT * FROM users`;

// Example: Create user  
await sql`
  INSERT INTO users (name, email)
  VALUES (${name}, ${email})
`;

// Example: Update user
await sql`
  UPDATE users 
  SET name = ${name}
  WHERE id = ${id}
`;
```

## 🚀 Deploy to Railway

### Option 1: One-Click (Recommended)
Click the deploy button above. Railway automatically:
1. Creates PostgreSQL database
2. Connects database to your app
3. Runs migrations
4. Generates domain with HTTPS

### Option 2: From Existing Repo
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Create new project
railway init

# Add PostgreSQL
railway add

# Deploy
railway up

# Your app is live!
```

## 🔍 Monitoring & Debugging

```bash
# View logs
railway logs

# Check database status
railway run bun run db:migrate

# Connect to database
railway connect postgres
```

## 📖 Extending This Template

```typescript
// Add new table migration
// src/database/migrations/003_add_comments.ts

export async function up(sql) {
  await sql`
    CREATE TABLE comments (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES posts(id),
      user_id INTEGER REFERENCES users(id),
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

// Add new API endpoint
// src/index.ts

if (url.pathname === '/comments') {
  const comments = await sql`SELECT * FROM comments`;
  return Response.json(comments);
}
```

## 🤝 Support & Community

- 📚 [Railway Documentation](https://docs.railway.com)
- 🐘 [PostgreSQL Docs](https://www.postgresql.org/docs/)
- 💬 [Railway Discord](https://discord.gg/railway)
- 🐛 [Report Issues](https://github.com/YOUR-USERNAME/railway-bun-templates/issues)
- ⭐ Star this repo if you find it useful!

## 📄 License

MIT - use freely in personal and commercial projects.

---

**Built with ⚡ by [Your Name]** | First Bun templates on Railway marketplace
