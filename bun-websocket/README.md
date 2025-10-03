# Bun WebSocket

Real-time WebSocket server built with Bun.

## Features

- 💬 WebSocket support
- 👥 User management
- 🏠 Chat rooms
- 🛡️ Rate limiting
- 💓 Heartbeat/ping-pong
- 🧪 Test client included

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

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/YOUR-CODE)

## Use Cases

- Chat applications
- Live dashboards
- Collaborative editors
- Real-time notifications
- Multiplayer games

## Performance

3-6x faster than Node.js WebSocket servers.

## License

MIT
