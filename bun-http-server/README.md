# Bun HTTP Server

Fast HTTP server built with Bun. Perfect for APIs, webhooks, and microservices.

## Features

- ⚡ 3-6x faster than Node.js
- 🔥 3x faster than Flask/Django
- ✅ TypeScript support
- 🏥 Health check endpoint
- 🔥 Hot reload in development
- 💪 Production optimized

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Production
bun run start
```

## Endpoints

- `GET /` - Welcome message with API info
- `GET /health` - Health check
- `GET /hello/:name` - Example parameterized route

## Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/YOUR-CODE)

## Environment Variables

- `PORT` - Server port (default: 3000)

## Use Cases

- REST APIs
- Webhooks
- Microservices
- Backend services
- API gateways

## Performance

3-6x faster than Node.js, 3x faster than Python Flask.

## License

MIT
