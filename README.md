# Hono Demo - Monorepo

Full-stack application built with Hono, React, and Cloudflare D1, structured as a monorepo using npm workspaces.

## Project Structure

```
hono-demo/
├── packages/
│   ├── backend/          # Hono API server
│   │   ├── src/          # Backend source code
│   │   └── wrangler.toml # Cloudflare Workers config
│   ├── frontend/         # React application
│   │   ├── src/          # Frontend source code
│   │   └── dist/         # Build output (served as static assets)
│   └── shared/           # Shared TypeScript types
│       ├── types.ts      # Common interfaces and types
│       └── index.ts      # Export barrel
├── db/
│   └── schema.sql        # Database schema
└── package.json          # Root workspace configuration
```

## Tech Stack

### Backend (@hono-demo/backend)
- **Framework**: [Hono](https://hono.dev/) - Ultrafast web framework
- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) - Serverless SQL database
- **Language**: TypeScript

### Frontend (@hono-demo/frontend)
- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: TypeScript

### Shared (@hono-demo/shared)
- TypeScript interfaces and types
- Shared between frontend and backend

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Cloudflare account (for deployment)
- Wrangler CLI (installed with dependencies)

### Installation

\`\`\`bash
# Install all dependencies
npm install
\`\`\`

### Development

\`\`\`bash
# Start backend development server (with remote D1 database)
npm run dev

# Start frontend development server (in a separate terminal)
npm run dev:frontend
\`\`\`

- Backend: http://localhost:8787
- Frontend: http://localhost:5173

### Building

\`\`\`bash
# Build everything
npm run build

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend
\`\`\`

### Deployment

\`\`\`bash
# Deploy to Cloudflare Workers (builds frontend first)
npm run deploy
\`\`\`

Production URL: https://hono-demo.tuan28064.workers.dev

## API Endpoints

All API endpoints are prefixed with /api:

- GET /api - API information
- GET /api/users - Get all users
- GET /api/users/:id - Get user by ID
- POST /api/users - Create new user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user
- GET /api/search?q=query - Search users

## Database

### Schema

The application uses Cloudflare D1 with a users table.

### Managing Database

\`\`\`bash
# Execute SQL on remote database
wrangler d1 execute hono-demo-db --remote --file=db/schema.sql

# Query database
wrangler d1 execute hono-demo-db --remote --command="SELECT * FROM users"
\`\`\`

## Monorepo Benefits

1. **Type Safety**: Shared types between frontend and backend
2. **Single Source of Truth**: One repository for the entire application
3. **Atomic Changes**: Update frontend and backend together
4. **Simplified CI/CD**: One deployment pipeline
5. **Easy Local Development**: Clone once, everything is ready

## npm Workspaces Commands

\`\`\`bash
# Run command in specific workspace
npm run <script> -w @hono-demo/backend
npm run <script> -w @hono-demo/frontend

# Install dependency in specific workspace
npm install <package> -w @hono-demo/backend

# Clean all build artifacts and node_modules
npm run clean
\`\`\`

## License

ISC
