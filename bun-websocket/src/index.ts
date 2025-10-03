import { WebSocketClient, ServerStats, WebSocketEvent } from './types';
import { MessageHandler } from './handlers/messageHandler';
import { 
  generateId, 
  getServerStats, 
  createMessage, 
  createHeartbeat, 
  logEvent,
  getClientIP 
} from './utils';

class WebSocketServer {
  private server: any;
  private clients: Map<string, WebSocketClient>;
  private messageHandler: MessageHandler;
  private heartbeatInterval: NodeJS.Timeout | null;
  private statsInterval: NodeJS.Timeout | null;
  private totalConnections: number;
  private totalMessages: number;
  private startTime: number;

  constructor(port: number = 3000) {
    this.clients = new Map();
    this.messageHandler = new MessageHandler(this.clients);
    this.totalConnections = 0;
    this.totalMessages = 0;
    this.startTime = Date.now();
    this.heartbeatInterval = null;
    this.statsInterval = null;

    // Create HTTP server with WebSocket upgrade
    this.server = Bun.serve({
      port,
      fetch: this.handleHttpRequest.bind(this),
      websocket: {
        message: this.handleWebSocketMessage.bind(this),
        open: this.handleWebSocketOpen.bind(this),
        close: this.handleWebSocketClose.bind(this),
        drain: this.handleWebSocketDrain.bind(this),
        error: this.handleWebSocketError.bind(this),
      },
    });

    // Start heartbeat
    this.heartbeatInterval = createHeartbeat(this.clients);

    // Start stats logging
    this.statsInterval = setInterval(() => {
      this.logStats();
    }, 60000); // Log stats every minute

    console.log(`🚀 WebSocket Server running at http://localhost:${port}`);
    console.log(`📡 WebSocket endpoint: ws://localhost:${port}`);
    console.log(`🌐 HTTP endpoint: http://localhost:${port}`);
    console.log(`💓 Health check: http://localhost:${port}/health`);
  }

  // Handle HTTP requests
  private async handleHttpRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Enable CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
      // Health check endpoint
      if (path === '/health') {
        const stats = this.getServerStats();
        return new Response(JSON.stringify({
          success: true,
          data: stats,
          timestamp: new Date().toISOString(),
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Server info endpoint
      if (path === '/info') {
        const info = {
          name: 'Bun WebSocket Server',
          version: '1.0.0',
          description: 'Real-time WebSocket chat server built with Bun',
          features: [
            'Real-time messaging',
            'User presence',
            'Typing indicators',
            'Message history',
            'Rate limiting',
            'Heartbeat monitoring',
            'CORS support',
            'Health checks',
          ],
          endpoints: {
            websocket: `ws://localhost:${this.server.port}`,
            health: `http://localhost:${this.server.port}/health`,
            info: `http://localhost:${this.server.port}/info`,
            stats: `http://localhost:${this.server.port}/stats`,
          },
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
        };

        return new Response(JSON.stringify({
          success: true,
          data: info,
          timestamp: new Date().toISOString(),
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Server statistics endpoint
      if (path === '/stats') {
        const stats = this.getServerStats();
        return new Response(JSON.stringify({
          success: true,
          data: stats,
          timestamp: new Date().toISOString(),
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Simple HTML client for testing
      if (path === '/' || path === '/client') {
        const html = this.generateTestClient();
        return new Response(html, {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        });
      }

      // 404 for unknown routes
      return new Response(JSON.stringify({
        success: false,
        error: 'Not Found',
        message: `Route ${path} not found`,
        timestamp: new Date().toISOString(),
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });

    } catch (error) {
      console.error('HTTP request error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }

  // Handle new WebSocket connection
  private handleWebSocketOpen(ws: WebSocket, request: Request): void {
    const clientId = generateId();
    const clientIP = getClientIP(request);

    // Create client object
    const client: WebSocketClient = {
      id: clientId,
      socket: ws,
      user: null,
      lastPing: Date.now(),
      isAlive: true,
    };

    // Add client to clients map
    this.clients.set(clientId, client);
    this.totalConnections++;

    // Log connection event
    logEvent({
      type: 'connection',
      clientId,
      data: { ip: clientIP },
      timestamp: new Date().toISOString(),
    });

    console.log(`🔗 Client connected: ${clientId} (${clientIP})`);
    console.log(`📊 Active connections: ${this.clients.size}`);

    // Send welcome message
    const welcomeMessage = createMessage('welcome', {
      clientId,
      message: 'Connected to WebSocket server',
      timestamp: new Date().toISOString(),
      instructions: {
        join: { type: 'join', data: { username: 'YourUsername' } },
        chat: { type: 'chat', data: { content: 'Your message' } },
        ping: { type: 'ping', data: { timestamp: new Date().toISOString() } },
      },
    });

    try {
      ws.send(JSON.stringify(welcomeMessage));
    } catch (error) {
      console.error(`Failed to send welcome message to client ${clientId}:`, error);
    }
  }

  // Handle incoming WebSocket messages
  private async handleWebSocketMessage(ws: WebSocket, message: string): void {
    // Find client by socket
    let client: WebSocketClient | undefined;
    let clientId: string | undefined;

    for (const [id, c] of this.clients) {
      if (c.socket === ws) {
        client = c;
        clientId = id;
        break;
      }
    }

    if (!client || !clientId) {
      console.error('Received message from unknown client');
      return;
    }

    this.totalMessages++;

    // Handle message
    const response = await this.messageHandler.handleMessage(clientId, message);

    // Send response if any
    if (response) {
      try {
        ws.send(JSON.stringify(response));
      } catch (error) {
        console.error(`Failed to send response to client ${clientId}:`, error);
      }
    }
  }

  // Handle WebSocket connection close
  private handleWebSocketClose(ws: WebSocket, code: number, reason: string): void {
    // Find and remove client
    for (const [clientId, client] of this.clients) {
      if (client.socket === ws) {
        this.messageHandler.handleDisconnect(clientId);
        this.clients.delete(clientId);
        
        console.log(`🔌 Client disconnected: ${clientId} (code: ${code}, reason: ${reason})`);
        console.log(`📊 Active connections: ${this.clients.size}`);
        break;
      }
    }
  }

  // Handle WebSocket drain (backpressure)
  private handleWebSocketDrain(ws: WebSocket): void {
    // Find client
    for (const [clientId, client] of this.clients) {
      if (client.socket === ws) {
        console.log(`⚠️  Client buffer drained: ${clientId}`);
        break;
      }
    }
  }

  // Handle WebSocket errors
  private handleWebSocketError(ws: WebSocket, error: Error): void {
    // Find client
    for (const [clientId, client] of this.clients) {
      if (client.socket === ws) {
        console.error(`❌ WebSocket error for client ${clientId}:`, error);
        
        // Remove client on error
        this.messageHandler.handleDisconnect(clientId);
        this.clients.delete(clientId);
        break;
      }
    }
  }

  // Get server statistics
  private getServerStats(): ServerStats {
    const messageHandlerStats = this.messageHandler.getStats();
    
    return getServerStats(
      this.totalConnections,
      this.clients.size,
      this.totalMessages,
      1, // Single room for now
      this.clients.size > 0 ? 1 : 0
    );
  }

  // Log server statistics
  private logStats(): void {
    const stats = this.getServerStats();
    const uptime = Math.floor(stats.uptime);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;

    console.log(`📈 Server Stats - Uptime: ${hours}h ${minutes}m ${seconds}s, ` +
                `Connections: ${stats.activeConnections}/${stats.totalConnections}, ` +
                `Messages: ${stats.totalMessages}, ` +
                `Memory: ${stats.memoryUsage.used}MB (${stats.memoryUsage.percentage}%)`);
  }

  // Generate simple HTML test client
  private generateTestClient(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket Test Client</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 20px; }
        .status { padding: 10px; border-radius: 4px; margin-bottom: 20px; }
        .connected { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .disconnected { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .join-form { margin-bottom: 20px; }
        .chat-form { display: flex; gap: 10px; margin-bottom: 20px; }
        .chat-form input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .chat-form button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .chat-form button:hover { background: #0056b3; }
        .messages { height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; border-radius: 4px; margin-bottom: 20px; }
        .message { margin-bottom: 10px; padding: 8px; border-radius: 4px; }
        .system { background: #e9ecef; color: #6c757d; font-style: italic; }
        .user { background: #f8f9fa; border-left: 4px solid #007bff; }
        .username { font-weight: bold; margin-right: 8px; }
        .timestamp { font-size: 0.8em; color: #6c757d; margin-left: 8px; }
        .users { background: #f8f9fa; padding: 10px; border-radius: 4px; }
        .user-count { font-weight: bold; margin-bottom: 10px; }
        .user-item { margin-bottom: 5px; }
        .hidden { display: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 WebSocket Test Client</h1>
            <p>Test your Bun WebSocket server in real-time</p>
        </div>

        <div id="status" class="status disconnected">
            ❌ Disconnected
        </div>

        <div id="join-section" class="join-form">
            <h3>Join Chat</h3>
            <input type="text" id="username" placeholder="Enter your username" maxlength="20">
            <button onclick="joinChat()">Join Chat</button>
        </div>

        <div id="chat-section" class="hidden">
            <div class="chat-form">
                <input type="text" id="message" placeholder="Type your message..." maxlength="500" onkeypress="handleKeyPress(event)">
                <button onclick="sendMessage()">Send</button>
            </div>

            <div class="users">
                <div class="user-count">Online Users: <span id="user-count">0</span></div>
                <div id="user-list"></div>
            </div>

            <div class="messages" id="messages"></div>
        </div>
    </div>

    <script>
        let ws = null;
        let username = '';
        let joined = false;

        function connect() {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = \`\${protocol}//\${window.location.host}\`;
            
            ws = new WebSocket(wsUrl);
            
            ws.onopen = function() {
                updateStatus('connected', '✅ Connected');
                console.log('Connected to WebSocket server');
            };

            ws.onmessage = function(event) {
                const message = JSON.parse(event.data);
                handleMessage(message);
            };

            ws.onclose = function() {
                updateStatus('disconnected', '❌ Disconnected');
                console.log('Disconnected from WebSocket server');
                setTimeout(connect, 5000); // Reconnect after 5 seconds
            };

            ws.onerror = function(error) {
                console.error('WebSocket error:', error);
                updateStatus('disconnected', '❌ Connection Error');
            };
        }

        function updateStatus(status, text) {
            const statusEl = document.getElementById('status');
            statusEl.className = \`status \${status}\`;
            statusEl.textContent = text;
        }

        function joinChat() {
            const usernameInput = document.getElementById('username');
            username = usernameInput.value.trim();
            
            if (!username) {
                alert('Please enter a username');
                return;
            }

            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'join',
                    data: { username: username }
                }));
            }
        }

        function sendMessage() {
            const messageInput = document.getElementById('message');
            const content = messageInput.value.trim();
            
            if (!content) return;

            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'chat',
                    data: { content: content }
                }));
                messageInput.value = '';
            }
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }

        function handleMessage(message) {
            console.log('Received message:', message);

            switch (message.type) {
                case 'welcome':
                    // Welcome message received
                    break;

                case 'chat_history':
                    // Load message history
                    message.data.messages.forEach(msg => {
                        displayMessage(msg);
                    });
                    break;

                case 'user_list':
                    // Update user list
                    updateUserList(message.data.users);
                    break;

                case 'user_count':
                    // Update user count
                    document.getElementById('user-count').textContent = message.data.count;
                    break;

                case 'chat':
                    // Display chat message
                    displayMessage(message);
                    break;

                case 'typing':
                    // Handle typing indicators (could be implemented)
                    break;

                case 'system':
                    // Display system message
                    displayMessage(message);
                    break;

                case 'error':
                    alert('Error: ' + message.data.message);
                    break;

                case 'pong':
                    // Pong response (heartbeat)
                    break;
            }

            // Hide join section and show chat section after joining
            if (message.type === 'chat_history' || message.type === 'user_list') {
                if (!joined) {
                    joined = true;
                    document.getElementById('join-section').classList.add('hidden');
                    document.getElementById('chat-section').classList.remove('hidden');
                }
            }
        }

        function displayMessage(message) {
            const messagesEl = document.getElementById('messages');
            const messageEl = document.createElement('div');
            
            if (message.type === 'system') {
                messageEl.className = 'message system';
                messageEl.innerHTML = \`<span class="timestamp">\${formatTime(message.timestamp)}</span> \${message.content}\`;
            } else if (message.type === 'chat') {
                messageEl.className = 'message user';
                messageEl.innerHTML = \`<span class="username" style="color: \${message.userColor}">\${message.username}:</span> \${message.content} <span class="timestamp">\${formatTime(message.timestamp)}</span>\`;
            }
            
            messagesEl.appendChild(messageEl);
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }

        function updateUserList(users) {
            const userListEl = document.getElementById('user-list');
            const userCountEl = document.getElementById('user-count');
            
            userCountEl.textContent = users.length;
            userListEl.innerHTML = '';
            
            users.forEach(user => {
                const userEl = document.createElement('div');
                userEl.className = 'user-item';
                userEl.innerHTML = \`<span style="color: \${user.color}">●</span> \${user.name}\`;
                userListEl.appendChild(userEl);
            });
        }

        function formatTime(timestamp) {
            return new Date(timestamp).toLocaleTimeString();
        }

        // Connect on page load
        connect();
    </script>
</body>
</html>
    `;
  }

  // Shutdown server
  public shutdown(): void {
    console.log('🛑 Shutting down WebSocket server...');

    // Clear intervals
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }

    // Close all client connections
    this.clients.forEach((client, clientId) => {
      try {
        client.socket.close(1001, 'Server shutting down');
      } catch (error) {
        console.error(`Error closing client ${clientId}:`, error);
      }
    });

    // Clear clients map
    this.clients.clear();

    console.log('✅ WebSocket server shutdown complete');
  }
}

// Start the server
const port = parseInt(process.env.PORT || '3000');
const server = new WebSocketServer(port);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  server.shutdown();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  server.shutdown();
  process.exit(0);
});

export default server;
