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

## Deploy publicly

The frontend is a static site and can be deployed to GitHub Pages. The GraphQL
backend must run separately; `render.yaml` defines a Render web service for it.

1. In Render, create a Blueprint from this repository and deploy the
   `taskflow-graphql-api` web service. Copy its public URL (for example,
   `https://taskflow-graphql-api.onrender.com/`).
2. In the GitHub repository, open **Settings → Pages** and set the build
   source to **GitHub Actions**.
3. Open **Settings → Secrets and variables → Actions → Variables** and add a
   repository variable named `VITE_GRAPHQL_URL` containing the Render URL,
   including `https://` and the trailing `/`.
4. Run the **Deploy frontend to GitHub Pages** workflow from the **Actions**
   tab, or push a change under `frontend/`.

The published app will be available at
`https://karthik23242241.github.io/taskflow-graphql/`. If the GraphQL URL is not
configured, the deployed frontend falls back to localhost and cannot load
tasks.
