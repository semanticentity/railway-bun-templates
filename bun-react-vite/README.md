# Bun React Vite

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/YOUR-CODE)
[![Tests](https://github.com/semanticentity/railway-bun-templates/workflows/Tests/badge.svg)](https://github.com/semanticentity/railway-bun-templates/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Modern React application with Vite and Bun.** Lightning-fast development experience with instant HMR, optimized production builds, and **10x faster** package installs than npm.

Perfect for single-page applications, dashboards, admin panels, and modern web applications.

## Features

- **React 18** - Latest React with concurrent features
- **Vite** - Instant hot module replacement (HMR)
- **Bun** - 10x faster installs than npm
- **TypeScript** - Full type safety
- **Responsive design** - Mobile-first approach
- **Production optimized** - Built-in optimizations and health checks

## Quick Start

```bash
bun install
bun run dev
```

## Scripts

- `bun run dev` - Development server with HMR
- `bun run build` - Production build
- `bun run preview` - Preview production build

## Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/YOUR-CODE)

## Use Cases

- Single-page applications
- Dashboards
- Admin panels
- Landing pages
- Web applications

## Performance

- **10x faster** package installs than npm
- **Instant HMR** with Vite
- **Optimized builds** with tree-shaking
- **Fast deploys** on Railway

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port (Railway sets this automatically) |

## Local Development

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Start development server with HMR
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Start production server
bun run start
```

## Project Structure

```
bun-react-vite/
├── src/
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── server.ts            # Production server with health checks
├── package.json         # Dependencies and scripts
├── railway.json         # Railway configuration
└── vite.config.ts       # Vite configuration
```

## Support & Community

- [Railway Documentation](https://docs.railway.com)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Report Issues](https://github.com/semanticentity/railway-bun-templates/issues)
- Star this repo if you find it useful

## License

MIT - use freely in personal and commercial projects.

---

**Built by semanticentity** | First Bun templates on Railway marketplace
