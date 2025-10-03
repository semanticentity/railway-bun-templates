# Bun WebSocket

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/semanticentity/railway-bun-templates/tree/main/bun-websocket)
[![Tests](https://github.com/semanticentity/railway-bun-templates/workflows/Tests/badge.svg)](https://github.com/semanticentity/railway-bun-templates/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Real-time WebSocket server built with Bun.** High-performance WebSocket server delivering **3-6x better performance** than Node.js with built-in chat functionality, user management, and rate limiting.

Perfect for chat applications, live dashboards, collaborative tools, and any real-time communication needs.

## Features

- **WebSocket support** - Full WebSocket protocol implementation
- **User management** - Track connected users and sessions
- **Chat rooms** - Multi-room chat functionality
- **Rate limiting** - Prevent spam and abuse
- **Heartbeat/ping-pong** - Connection health monitoring
- **Test client included** - Built-in web client for testing

## Quick Start

```bash
bun install
bun run dev
```

## Test Client

Open `http://localhost:3000/test` to try the chat.

## WebSocket API

```javascript
// Connect
const ws = new WebSocket('ws://localhost:3000');

// Send message
ws.send(JSON.stringify({ type: 'message', content: 'Hello' }));

// Receive message
ws.onmessage = (event) => {
  console.log(JSON.parse(event.data));
};
```

## Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/semanticentity/railway-bun-templates/tree/main/bun-websocket)

## Use Cases

- Chat applications
- Live dashboards
- Collaborative editors
- Real-time notifications
- Multiplayer games

## Performance

- **3-6x faster** than Node.js WebSocket servers
- **Low latency** real-time communication
- **High throughput** message handling
- **Efficient** connection management

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

# Start development server
bun run dev

# Test the WebSocket connection
# Open http://localhost:3000/test in your browser

# Start production server
bun run start
```

## WebSocket Events

The server supports the following event types:

```typescript
// Join (automatic on connect)
{ type: 'join', username: string }

// Message
{ type: 'message', content: string }

// Heartbeat
{ type: 'ping' }

// Response
{ type: 'pong' }
```

## Support & Community

- [Railway Documentation](https://docs.railway.com)
- [Bun Documentation](https://bun.sh/docs)
- [WebSocket API Docs](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Report Issues](https://github.com/semanticentity/railway-bun-templates/issues)
- Star this repo if you find it useful

## License

MIT - use freely in personal and commercial projects.

---

**Built by semanticentity**