# Taskflow GraphQL

A small task manager with a React, TypeScript, and Apollo Client frontend and an Apollo Server GraphQL backend. The backend starts with four sample tasks. Tasks are stored in memory and reset when the backend restarts.

## Requirements

- Node.js 20.19 or later
- npm

## Run locally

In one terminal:

```powershell
cd backend
npm install
npm run dev
```

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the frontend at `http://localhost:3000`. The GraphQL API and Apollo Sandbox are available at `http://localhost:4000/`.

To create a production frontend build, run `npm run build` from `frontend`.
