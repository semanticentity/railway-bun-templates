// WebSocket message types
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
  id?: string;
}

// User information
export interface User {
  id: string;
  name: string;
  color: string;
  joinedAt: string;
  isActive: boolean;
}

// Chat message
export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  userColor: string;
  content: string;
  timestamp: string;
}

// System message
export interface SystemMessage {
  id: string;
  content: string;
  timestamp: string;
  type: 'user_joined' | 'user_left' | 'system';
}

// Message types
export interface JoinMessage {
  type: 'join';
  data: {
    username: string;
  };
}

export interface ChatMessageData {
  type: 'chat';
  data: {
    content: string;
  };
}

export interface UserListMessage {
  type: 'user_list';
  data: {
    users: User[];
  };
}

export interface PingMessage {
  type: 'ping';
  data: {
    timestamp: string;
  };
}

export interface PongMessage {
  type: 'pong';
  data: {
    timestamp: string;
  };
}

export interface ErrorMessage {
  type: 'error';
  data: {
    message: string;
    code?: string;
  };
}

export interface TypingMessage {
  type: 'typing';
  data: {
    isTyping: boolean;
  };
}

export interface UserCountMessage {
  type: 'user_count';
  data: {
    count: number;
  };
}

// Union of all possible message types
export type ClientMessage = JoinMessage | ChatMessageData | PingMessage | TypingMessage;
export type ServerMessage = WebSocketMessage & 
  (ChatMessage | SystemMessage | UserListMessage | PongMessage | ErrorMessage | UserCountMessage);

// WebSocket client interface
export interface WebSocketClient {
  id: string;
  socket: WebSocket;
  user: User | null;
  lastPing: number;
  isAlive: boolean;
}

// Room interface for multi-room support
export interface Room {
  id: string;
  name: string;
  clients: Map<string, WebSocketClient>;
  messages: (ChatMessage | SystemMessage)[];
  createdAt: string;
}

// Server statistics
export interface ServerStats {
  totalConnections: number;
  activeConnections: number;
  totalMessages: number;
  uptime: number;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  rooms: {
    total: number;
    active: number;
  };
}

// Event types
export interface WebSocketEvent {
  type: 'connection' | 'disconnection' | 'message' | 'error';
  clientId: string;
  data?: any;
  timestamp: string;
}
