/**
 * Production server for Bun React Vite
 * Serves static files from the dist directory with health check endpoint
 */

const PORT = process.env.PORT || 3000;
const DIST_DIR = "./dist";

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    
    // Health check endpoint
    if (url.pathname === "/health" || url.pathname === "/api/health") {
      return new Response(
        JSON.stringify({
          status: "ok",
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          service: "bun-react-vite",
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Serve static files
    const filePath = url.pathname === "/" ? "/index.html" : url.pathname;
    const file = Bun.file(`${DIST_DIR}${filePath}`);

    // Check if file exists
    const exists = await file.exists();
    
    if (exists) {
      return new Response(file);
    }

    // Fallback to index.html for SPA routing
    const indexFile = Bun.file(`${DIST_DIR}/index.html`);
    if (await indexFile.exists()) {
      return new Response(indexFile);
    }

    // 404 if index.html doesn't exist
    return new Response("Not Found", { status: 404 });
  },
  error(error) {
    console.error("Server error:", error);
    return new Response("Internal Server Error", { status: 500 });
  },
});

console.log(`🚀 Server running at http://localhost:${server.port}`);
console.log(`📊 Health check available at http://localhost:${server.port}/health`);
