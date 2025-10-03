import { postgres } from 'postgres';

// Database connection
const sql = postgres(process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/mydb', {
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize database
async function initDatabase() {
  try {
    // Create users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create posts table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Health check with database
async function healthCheck() {
  try {
    const result = await sql`SELECT NOW() as time`;
    return {
      status: 'healthy',
      database: 'connected',
      timestamp: result[0].time,
      uptime: process.uptime()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}

const server = Bun.serve({
  port: process.env.PORT || 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const method = req.method;

    // Enable CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
      // Health check endpoint
      if (url.pathname === '/health') {
        const health = await healthCheck();
        return new Response(JSON.stringify(health), {
          status: health.status === 'healthy' ? 200 : 503,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Get all users
      if (url.pathname === '/users' && method === 'GET') {
        const users = await sql`SELECT * FROM users ORDER BY created_at DESC`;
        return new Response(JSON.stringify({ users }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Create a new user
      if (url.pathname === '/users' && method === 'POST') {
        const body = await req.json();
        const { name, email } = body;

        if (!name || !email) {
          return new Response(JSON.stringify({ error: 'Name and email are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        const user = await sql`
          INSERT INTO users (name, email)
          VALUES (${name}, ${email})
          RETURNING *
        `;

        return new Response(JSON.stringify({ user: user[0] }), {
          status: 201,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Get all posts
      if (url.pathname === '/posts' && method === 'GET') {
        const posts = await sql`
          SELECT p.*, u.name as author_name 
          FROM posts p 
          LEFT JOIN users u ON p.user_id = u.id 
          ORDER BY p.created_at DESC
        `;
        return new Response(JSON.stringify({ posts }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Create a new post
      if (url.pathname === '/posts' && method === 'POST') {
        const body = await req.json();
        const { title, content, user_id } = body;

        if (!title || !user_id) {
          return new Response(JSON.stringify({ error: 'Title and user_id are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        const post = await sql`
          INSERT INTO posts (title, content, user_id)
          VALUES (${title}, ${content || null}, ${user_id})
          RETURNING *
        `;

        return new Response(JSON.stringify({ post: post[0] }), {
          status: 201,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Root endpoint
      if (url.pathname === '/') {
        return new Response(JSON.stringify({
          message: 'Bun + PostgreSQL API on Railway',
          version: Bun.version,
          endpoints: [
            { path: '/', method: 'GET', description: 'API information' },
            { path: '/health', method: 'GET', description: 'Health check with database' },
            { path: '/users', method: 'GET', description: 'Get all users' },
            { path: '/users', method: 'POST', description: 'Create a new user' },
            { path: '/posts', method: 'GET', description: 'Get all posts with author info' },
            { path: '/posts', method: 'POST', description: 'Create a new post' }
          ]
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // 404 for unknown routes
      return new Response(JSON.stringify({
        error: 'Not Found',
        message: `Route ${url.pathname} not found`,
        timestamp: new Date().toISOString()
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } catch (error) {
      console.error('Request error:', error);
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  },
});

// Initialize database and start server
async function startServer() {
  await initDatabase();
  console.log(`🚀 Server running at http://localhost:${server.port}`);
  console.log(`📊 Health check: http://localhost:${server.port}/health`);
  console.log(`👥 Users API: http://localhost:${server.port}/users`);
  console.log(`📝 Posts API: http://localhost:${server.port}/posts`);
}

startServer().catch(console.error);

export default server;
