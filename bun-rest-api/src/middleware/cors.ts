import { logRequest } from '../utils';

export interface CorsOptions {
  origin?: string | string[];
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

const defaultCorsOptions: CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

export function cors(options: CorsOptions = defaultCorsOptions) {
  const finalOptions = { ...defaultCorsOptions, ...options };
  
  return (request: Request): Response | null => {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      const headers: Record<string, string> = {};
      
      // Set origin
      if (finalOptions.origin === '*') {
        headers['Access-Control-Allow-Origin'] = '*';
      } else if (Array.isArray(finalOptions.origin)) {
        const origin = request.headers.get('origin');
        if (origin && finalOptions.origin.includes(origin)) {
          headers['Access-Control-Allow-Origin'] = origin;
        }
      } else {
        headers['Access-Control-Allow-Origin'] = finalOptions.origin as string;
      }
      
      // Set methods
      headers['Access-Control-Allow-Methods'] = finalOptions.methods?.join(', ') || '';
      
      // Set allowed headers
      headers['Access-Control-Allow-Headers'] = finalOptions.allowedHeaders?.join(', ') || '';
      
      // Set exposed headers
      if (finalOptions.exposedHeaders?.length) {
        headers['Access-Control-Expose-Headers'] = finalOptions.exposedHeaders.join(', ');
      }
      
      // Set credentials
      if (finalOptions.credentials) {
        headers['Access-Control-Allow-Credentials'] = 'true';
      }
      
      // Set max age
      if (finalOptions.maxAge) {
        headers['Access-Control-Max-Age'] = finalOptions.maxAge.toString();
      }
      
      return new Response(null, { status: 204, headers });
    }
    
    return null; // Continue to next handler
  };
}

export function addCorsHeaders(response: Response, request: Request, options: CorsOptions = defaultCorsOptions): Response {
  const finalOptions = { ...defaultCorsOptions, ...options };
  const headers = new Headers(response.headers);
  
  // Set origin
  if (finalOptions.origin === '*') {
    headers.set('Access-Control-Allow-Origin', '*');
  } else if (Array.isArray(finalOptions.origin)) {
    const origin = request.headers.get('origin');
    if (origin && finalOptions.origin.includes(origin)) {
      headers.set('Access-Control-Allow-Origin', origin);
    }
  } else {
    headers.set('Access-Control-Allow-Origin', finalOptions.origin as string);
  }
  
  // Set other headers
  if (finalOptions.exposedHeaders?.length) {
    headers.set('Access-Control-Expose-Headers', finalOptions.exposedHeaders.join(', '));
  }
  
  if (finalOptions.credentials) {
    headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Middleware to log requests
export function requestLogger(request: Request): Response | null {
  const method = request.method;
  const url = request.url;
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  
  logRequest(method, url, userAgent);
  
  return null; // Continue to next handler
}

// Middleware to validate content type
export function validateContentType(request: Request, expectedTypes: string[] = ['application/json']): Response | null {
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentType = request.headers.get('content-type');
    
    if (!contentType || !expectedTypes.some(type => contentType.includes(type))) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Unsupported content type. Expected: ${expectedTypes.join(', ')}`,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 415,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }
  
  return null; // Continue to next handler
}

// Middleware to add security headers
export function securityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  
  // Security headers
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  headers.set('Content-Security-Policy', "default-src 'self'");
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
