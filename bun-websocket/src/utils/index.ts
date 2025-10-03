import { WebSocketMessage, User, ServerStats, WebSocketEvent } from '../types';

// Utility to generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Utility to generate random color for users
export function generateColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Utility to validate username
export function validateUsername(username: string): { isValid: boolean; error?: string } {
  if (!username || username.trim().length === 0) {
    return { isValid: false, error: 'Username is required' };
  }
  
  if (username.length < 2) {
    return { isValid: false, error: 'Username must be at least 2 characters long' };
  }
  
  if (username.length > 20) {
    return { isValid: false, error: 'Username must be less than 20 characters long' };
  }
  
  if (!/^[a-zA-Z0-9_\s]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, underscores, and spaces' };
  }
  
  if (username.trim().toLowerCase() === 'system') {
    return { isValid: false, error: 'Username "system" is reserved' };
  }
  
  return { isValid: true };
}

// Utility to sanitize message content
export function sanitizeMessage(content: string): string {
  return content.trim().substring(0, 500); // Limit to 500 characters
}

// Utility to create standardized WebSocket messages
export function createMessage<T>(type: string, data: T): WebSocketMessage & { data: T } {
  return {
    type,
    data,
    timestamp: new Date().toISOString(),
    id: generateId(),
  };
}

// Utility to create server statistics
export function getServerStats(
  totalConnections: number,
  activeConnections: number,
  totalMessages: number,
  roomCount: number,
  activeRoomCount: number
): ServerStats {
  const memoryUsage = process.memoryUsage();
  const totalMemory = require('os').totalmem();
  
  return {
    totalConnections,
    activeConnections,
    totalMessages,
    uptime: process.uptime(),
    memoryUsage: {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(totalMemory / 1024 / 1024), // MB
      percentage: Math.round((memoryUsage.heapUsed / totalMemory) * 100 * 100) / 100,
    },
    rooms: {
      total: roomCount,
      active: activeRoomCount,
    },
  };
}

// Utility to format timestamp
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}

// Utility to check if user is online (based on last activity)
export function isUserOnline(lastActivity: number, timeoutMs: number = 30000): boolean {
  return Date.now() - lastActivity < timeoutMs;
}

// Utility to create system messages
export function createSystemMessage(content: string, type: 'user_joined' | 'user_left' | 'system' = 'system') {
  return {
    id: generateId(),
    content,
    timestamp: new Date().toISOString(),
    type,
  };
}

// Utility to log WebSocket events
export function logEvent(event: WebSocketEvent): void {
  const timestamp = new Date(event.timestamp).toLocaleTimeString();
  console.log(`[${timestamp}] WebSocket ${event.type}: ${event.clientId}${event.data ? ` - ${JSON.stringify(event.data)}` : ''}`);
}

// Utility to broadcast message to multiple clients
export function broadcastToClients(
  clients: Map<string, any>,
  message: any,
  excludeClientId?: string
): void {
  const messageString = JSON.stringify(message);
  
  clients.forEach((client, clientId) => {
    if (clientId !== excludeClientId && client.socket.readyState === WebSocket.OPEN) {
      try {
        client.socket.send(messageString);
      } catch (error) {
        console.error(`Failed to send message to client ${clientId}:`, error);
      }
    }
  });
}

// Utility to parse WebSocket message
export function parseMessage(message: string): any {
  try {
    return JSON.parse(message);
  } catch (error) {
    console.error('Failed to parse WebSocket message:', error);
    return null;
  }
}

// Utility to validate WebSocket message structure
export function validateMessage(message: any): { isValid: boolean; error?: string } {
  if (!message || typeof message !== 'object') {
    return { isValid: false, error: 'Message must be an object' };
  }
  
  if (!message.type || typeof message.type !== 'string') {
    return { isValid: false, error: 'Message must have a type field' };
  }
  
  if (!message.data || typeof message.data !== 'object') {
    return { isValid: false, error: 'Message must have a data field' };
  }
  
  return { isValid: true };
}

// Utility to get client IP address from request
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('remote-addr');
  
  return forwarded?.split(',')[0] || realIP || remoteAddr || 'unknown';
}

// Utility to rate limit messages
export class RateLimiter {
  private limits: Map<string, { count: number; resetTime: number }> = new Map();
  private maxMessages: number;
  private windowMs: number;

  constructor(maxMessages: number = 100, windowMs: number = 60000) {
    this.maxMessages = maxMessages;
    this.windowMs = windowMs;
  }

  canSend(clientId: string): boolean {
    const now = Date.now();
    const limit = this.limits.get(clientId);

    if (!limit || now > limit.resetTime) {
      // Reset limit
      this.limits.set(clientId, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (limit.count >= this.maxMessages) {
      return false;
    }

    limit.count++;
    return true;
  }

  getRemainingMessages(clientId: string): number {
    const limit = this.limits.get(clientId);
    if (!limit || Date.now() > limit.resetTime) {
      return this.maxMessages;
    }
    return Math.max(0, this.maxMessages - limit.count);
  }
}

// Utility to create heartbeat/ping mechanism
export function createHeartbeat(
  clients: Map<string, any>,
  intervalMs: number = 30000
): NodeJS.Timeout {
  return setInterval(() => {
    const pingMessage = createMessage('ping', { timestamp: new Date().toISOString() });
    
    clients.forEach((client, clientId) => {
      if (client.socket.readyState === WebSocket.OPEN) {
        try {
          client.socket.send(JSON.stringify(pingMessage));
          client.lastPing = Date.now();
        } catch (error) {
          console.error(`Failed to send ping to client ${clientId}:`, error);
        }
      }
    });
  }, intervalMs);
}
