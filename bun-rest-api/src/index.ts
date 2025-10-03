import { UserRoutes } from './routes/users';
import { PostRoutes } from './routes/posts';
import { CommentRoutes } from './routes/comments';
import { cors, addCorsHeaders, requestLogger, validateContentType, securityHeaders } from './middleware/cors';
import { successResponse, errorResponse, getMemoryUsage } from './utils';
import { HealthResponse } from './types';

// Initialize route handlers
const userRoutes = new UserRoutes();
const postRoutes = new PostRoutes();
const commentRoutes = new CommentRoutes();

// Health check endpoint
async function healthCheck(): Promise<HealthResponse> {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: Bun.version,
    environment: process.env.NODE_ENV || 'development',
    memory: getMemoryUsage(),
  };
}

const server = Bun.serve({
  port: process.env.PORT || 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const method = req.method;
    const path = url.pathname;

    // Apply middleware
    const corsResponse = cors()(req);
    if (corsResponse) return corsResponse;

    const logResponse = requestLogger(req);
    if (logResponse) return logResponse;

    const contentTypeResponse = validateContentType(req);
    if (contentTypeResponse) return contentTypeResponse;

    try {
      // Health check endpoint
      if (path === '/health' || path === '/api/health') {
        const health = await healthCheck();
        const response = new Response(JSON.stringify(successResponse(health)), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
        return addCorsHeaders(securityHeaders(response), req);
      }

      // API documentation endpoint
      if (path === '/api' || path === '/api/docs') {
        const docs = {
          name: 'Bun REST API Server',
          version: '1.0.0',
          description: 'A comprehensive REST API built with Bun and TypeScript',
          endpoints: {
            users: {
              'GET /api/users': 'Get all users with pagination',
              'GET /api/users/:id': 'Get user by ID',
              'POST /api/users': 'Create a new user',
              'PUT /api/users/:id': 'Update a user',
              'DELETE /api/users/:id': 'Delete a user',
              'GET /api/users/:id/posts': 'Get posts by user',
            },
            posts: {
              'GET /api/posts': 'Get all posts with pagination',
              'GET /api/posts/:id': 'Get post by ID',
              'POST /api/posts': 'Create a new post',
              'PUT /api/posts/:id': 'Update a post',
              'DELETE /api/posts/:id': 'Delete a post',
              'GET /api/posts/:id/comments': 'Get comments for a post',
            },
            comments: {
              'GET /api/comments': 'Get all comments with pagination',
              'GET /api/comments/:id': 'Get comment by ID',
              'POST /api/comments': 'Create a new comment',
              'DELETE /api/comments/:id': 'Delete a comment',
              'GET /api/comments/post/:postId': 'Get comments by post ID',
              'GET /api/comments/author/:authorId': 'Get comments by author ID',
            },
            health: {
              'GET /health': 'Health check endpoint',
              'GET /api/health': 'Health check endpoint',
            },
          },
          features: [
            'RESTful API design',
            'TypeScript support',
            'Pagination and sorting',
            'Input validation',
            'Error handling',
            'CORS enabled',
            'Security headers',
            'Request logging',
            'In-memory database',
          ],
        };

        const response = new Response(JSON.stringify(successResponse(docs)), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
        return addCorsHeaders(securityHeaders(response), req);
      }

      // Database stats endpoint
      if (path === '/api/stats') {
        const stats = await (await import('./utils/database')).database.getStats();
        const response = new Response(JSON.stringify(successResponse(stats)), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
        return addCorsHeaders(securityHeaders(response), req);
      }

      // User routes
      if (path.startsWith('/api/users')) {
        let response: Response;

        if (path === '/api/users' && method === 'GET') {
          response = await userRoutes.getUsers(req);
        } else if (path.match(/^\/api\/users\/[^\/]+$/) && method === 'GET') {
          response = await userRoutes.getUserById(req);
        } else if (path === '/api/users' && method === 'POST') {
          response = await userRoutes.createUser(req);
        } else if (path.match(/^\/api\/users\/[^\/]+$/) && method === 'PUT') {
          response = await userRoutes.updateUser(req);
        } else if (path.match(/^\/api\/users\/[^\/]+$/) && method === 'DELETE') {
          response = await userRoutes.deleteUser(req);
        } else if (path.match(/^\/api\/users\/[^\/]+\/posts$/) && method === 'GET') {
          response = await userRoutes.getUserPosts(req);
        } else {
          response = new Response(
            JSON.stringify(errorResponse('Method not allowed')),
            { status: 405, headers: { 'Content-Type': 'application/json' } }
          );
        }

        return addCorsHeaders(securityHeaders(response), req);
      }

      // Post routes
      if (path.startsWith('/api/posts')) {
        let response: Response;

        if (path === '/api/posts' && method === 'GET') {
          response = await postRoutes.getPosts(req);
        } else if (path.match(/^\/api\/posts\/[^\/]+$/) && method === 'GET') {
          response = await postRoutes.getPostById(req);
        } else if (path === '/api/posts' && method === 'POST') {
          response = await postRoutes.createPost(req);
        } else if (path.match(/^\/api\/posts\/[^\/]+$/) && method === 'PUT') {
          response = await postRoutes.updatePost(req);
        } else if (path.match(/^\/api\/posts\/[^\/]+$/) && method === 'DELETE') {
          response = await postRoutes.deletePost(req);
        } else if (path.match(/^\/api\/posts\/[^\/]+\/comments$/) && method === 'GET') {
          response = await postRoutes.getPostComments(req);
        } else {
          response = new Response(
            JSON.stringify(errorResponse('Method not allowed')),
            { status: 405, headers: { 'Content-Type': 'application/json' } }
          );
        }

        return addCorsHeaders(securityHeaders(response), req);
      }

      // Comment routes
      if (path.startsWith('/api/comments')) {
        let response: Response;

        if (path === '/api/comments' && method === 'GET') {
          response = await commentRoutes.getComments(req);
        } else if (path.match(/^\/api\/comments\/[^\/]+$/) && method === 'GET') {
          response = await commentRoutes.getCommentById(req);
        } else if (path === '/api/comments' && method === 'POST') {
          response = await commentRoutes.createComment(req);
        } else if (path.match(/^\/api\/comments\/[^\/]+$/) && method === 'DELETE') {
          response = await commentRoutes.deleteComment(req);
        } else if (path.match(/^\/api\/comments\/post\/[^\/]+$/) && method === 'GET') {
          response = await commentRoutes.getCommentsByPost(req);
        } else if (path.match(/^\/api\/comments\/author\/[^\/]+$/) && method === 'GET') {
          response = await commentRoutes.getCommentsByAuthor(req);
        } else {
          response = new Response(
            JSON.stringify(errorResponse('Method not allowed')),
            { status: 405, headers: { 'Content-Type': 'application/json' } }
          );
        }

        return addCorsHeaders(securityHeaders(response), req);
      }

      // Root endpoint
      if (path === '/') {
        const rootResponse = {
          message: 'Welcome to Bun REST API Server',
          version: '1.0.0',
          documentation: '/api/docs',
          health: '/health',
          timestamp: new Date().toISOString(),
        };

        const response = new Response(JSON.stringify(successResponse(rootResponse)), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
        return addCorsHeaders(securityHeaders(response), req);
      }

      // 404 for unknown routes
      const notFoundResponse = new Response(
        JSON.stringify(errorResponse('Route not found', `The path ${path} does not exist`)),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return addCorsHeaders(securityHeaders(notFoundResponse), req);

    } catch (error) {
      console.error('Unhandled error:', error);
      const errorResponse = new Response(
        JSON.stringify({
          success: false,
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return addCorsHeaders(securityHeaders(errorResponse), req);
    }
  },
});

console.log(`🚀 REST API Server running at http://localhost:${server.port}`);
console.log(`📚 API Documentation: http://localhost:${server.port}/api/docs`);
console.log(`💓 Health Check: http://localhost:${server.port}/health`);
console.log(`📊 Database Stats: http://localhost:${server.port}/api/stats`);

export default server;
