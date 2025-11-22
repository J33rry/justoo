## Inventory Frontend

Next.js dashboard for the inventory service. It talks directly to the inventory backend (`apps/inventory/backend`) over HTTP.

## Prerequisites

-   [Node.js 20+](https://nodejs.org)
-   [pnpm 9+](https://pnpm.io) (automatically used when you run commands inside the monorepo)
-   Inventory backend running locally on port `3001` (or your preferred port)

## Environment variables

Create an `.env` file (or copy the provided one) and make sure the following variables are set:

```bash
NEXT_PUBLIC_INVENTORY_API_URL=http://localhost:3001/api    # Base URL exposed to the browser
NEXT_PUBLIC_ADMIN_BACKEND_API_URL=http://localhost:3002/api # Optional admin bridge
```

> **Important:** `NEXT_PUBLIC_INVENTORY_API_URL` must point to the `/api` root of the backend. The frontend then calls `/auth`, `/inventory`, and `/orders` underneath that path. If this value misses `/api` you will get 404 responses.

## Install dependencies

```bash
pnpm install
```

## Local development

```bash
pnpm dev
```

The app runs on [http://localhost:3004](http://localhost:3004) by default.

## Troubleshooting 404 errors

-   Confirm the backend server log shows `🚀 Inventory API server is running on port 3001`.
-   Hit [http://localhost:3001/health](http://localhost:3001/health) and verify a JSON response.
-   Ensure `NEXT_PUBLIC_INVENTORY_API_URL` resolves to `http://localhost:3001/api`; trim extra slashes if needed.
-   Restart the frontend dev server after changing env vars (`CTRL+C` then `pnpm dev`).

If requests still fail, view the browser devtools network tab—the requested URL should match `http://localhost:3001/api/...`. Share the full failing URL and response payload when reporting issues.
