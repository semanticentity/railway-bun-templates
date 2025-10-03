import { ApiResponse, PaginatedResponse, PaginationParams } from '../types';

// Utility to create standardized API responses
export function createResponse<T>(
  success: boolean,
  data?: T,
  error?: string,
  message?: string
): ApiResponse<T> {
  return {
    success,
    data,
    error,
    message,
    timestamp: new Date().toISOString(),
  };
}

// Utility to create success responses
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return createResponse(true, data, undefined, message);
}

// Utility to create error responses
export function errorResponse(error: string, message?: string): ApiResponse {
  return createResponse(false, undefined, error, message);
}

// Utility to handle pagination
export function paginate<T>(
  data: T[],
  page: number = 1,
  limit: number = 10
): PaginatedResponse<T> {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
      hasNext: endIndex < data.length,
      hasPrev: page > 1,
    },
  };
}

// Utility to validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Utility to validate required fields
export function validateRequired(obj: any, fields: string[]): string[] {
  const errors: string[] = [];
  
  for (const field of fields) {
    if (!obj[field] || obj[field].toString().trim() === '') {
      errors.push(`${field} is required`);
    }
  }
  
  return errors;
}

// Utility to generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Utility to get memory usage
export function getMemoryUsage() {
  const used = process.memoryUsage();
  const total = require('os').totalmem();
  const percentage = (used.heapUsed / total) * 100;
  
  return {
    used: Math.round(used.heapUsed / 1024 / 1024), // MB
    total: Math.round(total / 1024 / 1024), // MB
    percentage: Math.round(percentage * 100) / 100,
  };
}

// Utility to parse query parameters
export function parseQueryParams(url: URL): PaginationParams {
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const sortBy = url.searchParams.get('sortBy') || 'createdAt';
  const sortOrder = (url.searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
  
  return {
    page: isNaN(page) ? 1 : Math.max(1, page),
    limit: isNaN(limit) ? 10 : Math.max(1, Math.min(100, limit)),
    sortBy,
    sortOrder,
  };
}

// Utility to sort array
export function sortArray<T>(array: T[], sortBy: string, sortOrder: 'asc' | 'desc'): T[] {
  return [...array].sort((a: any, b: any) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}

// Utility to delay execution (for simulating async operations)
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Utility to sanitize input
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// Utility to log requests
export function logRequest(method: string, url: string, userAgent?: string): void {
  console.log(`[${new Date().toISOString()}] ${method} ${url}${userAgent ? ` - ${userAgent}` : ''}`);
}
