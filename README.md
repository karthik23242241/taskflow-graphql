# Taskflow GraphQL

A small task manager with a React, TypeScript, and Apollo Client frontend and an Apollo Server GraphQL backend. The backend starts with four sample tasks. Tasks are stored in memory and reset when the backend restarts.

## Requirements

- Node.js 20.19 or later
- npm

## Run locally

```powershell
npm run setup
npm run dev
```

`npm run setup` installs the backend, frontend, and root development-runner dependencies. `npm run dev` starts both servers and stops both if either one exits.

Open the frontend at `http://localhost:3000`. The GraphQL API and Apollo Sandbox are available at `http://localhost:4000/`.

To create a production frontend build, run `npm --prefix frontend run build`.
