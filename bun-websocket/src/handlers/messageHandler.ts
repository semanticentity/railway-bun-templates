import {
  ClientMessage,
  ServerMessage,
  WebSocketClient,
  ChatMessage,
  SystemMessage,
  User,
  WebSocketEvent
} from '../types';
import {
  generateId,
  generateColor,
  validateUsername,
  sanitizeMessage,
  createMessage,
  createSystemMessage,
  validateMessage,
  parseMessage,
  RateLimiter,
  logEvent
} from '../utils';

export class MessageHandler {
  private clients: Map<string, WebSocketClient>;
  private rateLimiter: RateLimiter;
  private messageHistory: (ChatMessage | SystemMessage)[];
  private maxHistorySize: number;

  constructor(
    clients: Map<string, WebSocketClient>,
    maxHistorySize: number = 100,
    rateLimitMessages: number = 50,
    rateLimitWindowMs: number = 60000
  ) {
    this.clients = clients;
    this.rateLimiter = new RateLimiter(rateLimitMessages, rateLimitWindowMs);
    this.messageHistory = [];
    this.maxHistorySize = maxHistorySize;
  }

  // Handle incoming WebSocket messages
  async handleMessage(clientId: string, message: string): Promise<ServerMessage | null> {
    const client = this.clients.get(clientId);
    if (!client) {
      return createMessage('error', { message: 'Client not found', code: 'CLIENT_NOT_FOUND' });
    }

    // Parse and validate message
    const parsedMessage = parseMessage(message);
    if (!parsedMessage) {
      return createMessage('error', { message: 'Invalid message format', code: 'INVALID_FORMAT' });
    }

    const validation = validateMessage(parsedMessage);
    if (!validation.isValid) {
      return createMessage('error', { message: validation.error || 'Invalid message structure', code: 'INVALID_STRUCTURE' });
    }

    // Rate limiting
    if (!this.rateLimiter.canSend(clientId)) {
      return createMessage('error', { 
        message: 'Rate limit exceeded. Please slow down.', 
        code: 'RATE_LIMITED',
        remaining: this.rateLimiter.getRemainingMessages(clientId)
      });
    }

    const clientMessage = parsedMessage as ClientMessage;

    try {
      switch (clientMessage.type) {
        case 'join':
          return this.handleJoin(clientId, clientMessage);
        
        case 'chat':
          return this.handleChat(clientId, clientMessage);
        
        case 'ping':
          return this.handlePing(clientId, clientMessage);
        
        case 'typing':
          return this.handleTyping(clientId, clientMessage);
        
        default:
          return createMessage('error', { 
            message: `Unknown message type: ${clientMessage.type}`, 
            code: 'UNKNOWN_TYPE' 
          });
      }
    } catch (error) {
      console.error(`Error handling message from client ${clientId}:`, error);
      return createMessage('error', { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      });
    }
  }

  // Handle user joining
  private handleJoin(clientId: string, message: any): ServerMessage {
    const client = this.clients.get(clientId);
    if (!client) {
      return createMessage('error', { message: 'Client not found', code: 'CLIENT_NOT_FOUND' });
    }

    const { username } = message.data;
    const validation = validateUsername(username);
    
    if (!validation.isValid) {
      return createMessage('error', { message: validation.error, code: 'INVALID_USERNAME' });
    }

    // Check if username is already taken
    const isUsernameTaken = Array.from(this.clients.values()).some(
      c => c.user && c.user.name.toLowerCase() === username.toLowerCase() && c.id !== clientId
    );

    if (isUsernameTaken) {
      return createMessage('error', { message: 'Username is already taken', code: 'USERNAME_TAKEN' });
    }

    // Create user object
    const user: User = {
      id: clientId,
      name: username.trim(),
      color: generateColor(),
      joinedAt: new Date().toISOString(),
      isActive: true,
    };

    // Update client with user info
    client.user = user;

    // Create system message for user joining
    const joinMessage = createSystemMessage(`${user.name} joined the chat`, 'user_joined');
    this.addToHistory(joinMessage);

    // Log event
    logEvent({
      type: 'message',
      clientId,
      data: { action: 'join', username: user.name },
      timestamp: new Date().toISOString(),
    });

    // Broadcast join message to all clients
    this.broadcastToAll(joinMessage, clientId);

    // Send user list to all clients
    this.broadcastUserList();

    // Send recent message history to the new user
    return createMessage('chat_history', {
      messages: this.messageHistory.slice(-50), // Send last 50 messages
    });
  }

  // Handle chat messages
  private handleChat(clientId: string, message: any): ServerMessage {
    const client = this.clients.get(clientId);
    if (!client || !client.user) {
      return createMessage('error', { message: 'User not joined', code: 'USER_NOT_JOINED' });
    }

    const { content } = message.data;
    const sanitizedContent = sanitizeMessage(content);

    if (sanitizedContent.length === 0) {
      return createMessage('error', { message: 'Message cannot be empty', code: 'EMPTY_MESSAGE' });
    }

    // Create chat message
    const chatMessage: ChatMessage = {
      id: generateId(),
      userId: client.user.id,
      username: client.user.name,
      userColor: client.user.color,
      content: sanitizedContent,
      timestamp: new Date().toISOString(),
    };

    this.addToHistory(chatMessage);

    // Log event
    logEvent({
      type: 'message',
      clientId,
      data: { action: 'chat', content: sanitizedContent },
      timestamp: new Date().toISOString(),
    });

    // Broadcast chat message to all clients
    this.broadcastToAll(chatMessage);

    return null; // No direct response needed as it's broadcast
  }

  // Handle ping messages
  private handlePing(clientId: string, message: any): ServerMessage {
    const client = this.clients.get(clientId);
    if (!client) {
      return createMessage('error', { message: 'Client not found', code: 'CLIENT_NOT_FOUND' });
    }

    // Update last activity
    client.lastPing = Date.now();
    client.isAlive = true;

    // Log event
    logEvent({
      type: 'message',
      clientId,
      data: { action: 'ping' },
      timestamp: new Date().toISOString(),
    });

    // Send pong response
    return createMessage('pong', {
      timestamp: new Date().toISOString(),
    });
  }

  // Handle typing indicators
  private handleTyping(clientId: string, message: any): ServerMessage {
    const client = this.clients.get(clientId);
    if (!client || !client.user) {
      return createMessage('error', { message: 'User not joined', code: 'USER_NOT_JOINED' });
    }

    const { isTyping } = message.data;

    // Log event
    logEvent({
      type: 'message',
      clientId,
      data: { action: 'typing', isTyping },
      timestamp: new Date().toISOString(),
    });

    // Broadcast typing indicator to all other clients
    const typingMessage = createMessage('typing', {
      userId: clientId,
      username: client.user.name,
      userColor: client.user.color,
      isTyping,
      timestamp: new Date().toISOString(),
    });

    this.broadcastToAll(typingMessage, clientId);

    return null; // No direct response needed
  }

  // Handle client disconnection
  handleDisconnect(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client && client.user) {
      // Create system message for user leaving
      const leaveMessage = createSystemMessage(`${client.user.name} left the chat`, 'user_left');
      this.addToHistory(leaveMessage);

      // Log event
      logEvent({
        type: 'disconnection',
        clientId,
        data: { username: client.user.name },
        timestamp: new Date().toISOString(),
      });

      // Broadcast leave message to all clients
      this.broadcastToAll(leaveMessage, clientId);

      // Update user list
      this.broadcastUserList();
    }

    // Remove client from clients map
    this.clients.delete(clientId);
  }

  // Add message to history
  private addToHistory(message: ChatMessage | SystemMessage): void {
    this.messageHistory.push(message);
    
    // Keep history size limited
    if (this.messageHistory.length > this.maxHistorySize) {
      this.messageHistory = this.messageHistory.slice(-this.maxHistorySize);
    }
  }

  // Broadcast message to all clients
  private broadcastToAll(message: any, excludeClientId?: string): void {
    const messageString = JSON.stringify(message);
    
    this.clients.forEach((client, clientId) => {
      if (clientId !== excludeClientId && client.socket.readyState === WebSocket.OPEN) {
        try {
          client.socket.send(messageString);
        } catch (error) {
          console.error(`Failed to broadcast message to client ${clientId}:`, error);
        }
      }
    });
  }

  // Broadcast updated user list to all clients
  private broadcastUserList(): void {
    const users = Array.from(this.clients.values())
      .filter(client => client.user)
      .map(client => client.user!);

    const userListMessage = createMessage('user_list', { users });
    this.broadcastToAll(userListMessage);

    // Also broadcast user count
    const userCountMessage = createMessage('user_count', { count: users.length });
    this.broadcastToAll(userCountMessage);
  }

  // Get current user list
  getUserList(): User[] {
    return Array.from(this.clients.values())
      .filter(client => client.user)
      .map(client => client.user!);
  }

  // Get message history
  getMessageHistory(): (ChatMessage | SystemMessage)[] {
    return [...this.messageHistory];
  }

  // Get server statistics
  getStats() {
    return {
      totalClients: this.clients.size,
      activeUsers: this.getUserList().length,
      totalMessages: this.messageHistory.length,
      rateLimitInfo: {
        activeLimits: this.rateLimiter['limits'].size,
      },
    };
  }
}
