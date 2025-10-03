/**
 * Welcome to Bun on Railway!
 *
 * This is a simple HTTP server that demonstrates how to run a Bun
 * application on Railway. It includes a few example endpoints.
 */

const port = process.env.PORT || 3000;

console.log(`🚀 Starting server on port ${port}...`);

Bun.serve({
  port: port,
  fetch(req) {
    const url = new URL(req.url);

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Dynamic greeting endpoint
    if (url.pathname.startsWith('/hello/')) {
      const name = url.pathname.split('/')[2];
      return new Response(JSON.stringify({
        message: `Hello, ${name || 'World'}!`,
        timestamp: new Date().toISOString(),
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Root endpoint with welcome message and available routes
    if (url.pathname === '/') {
      const serverInfo = {
        message: 'Welcome to Bun on Railway!',
        version: Bun.version,
        port: port,
        endpoints: {
          root: '/',
          health: '/health',
          greeting: '/hello/:name',
        },
        running_at: new Date().toISOString(),
      };
      return new Response(JSON.stringify(serverInfo, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 404 Not Found
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  },
  error() {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  },
});
