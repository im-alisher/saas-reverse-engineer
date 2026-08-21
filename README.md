# SaaS Reverse Engineer

SaaS Reverse Engineer analyzes a public SaaS website and produces structured product, market, architecture, database, API, and delivery insights. It is a portfolio-ready React and NestJS application backed by PostgreSQL and an OpenAI-compatible AI provider.

## Highlights

- Product summary, target audience, features, and workflows
- Competitor and revenue-model analysis
- Architecture, Prisma schema, and REST API recommendations
- MVP roadmap and export to Markdown or JSON
- Responsive dashboard, loading and empty states, and light/dark themes

## Stack

| Layer | Technology |
| --- | --- |
| Web | React 19, TypeScript, Vite, Tailwind CSS, TanStack Query |
| API | NestJS, TypeScript, Prisma |
| Data | PostgreSQL |
| AI | OpenAI-compatible API (Groq by default) |

## Requirements

- Node.js 22+ and npm 10+
- PostgreSQL 14+
- An API key for the configured AI provider

## Local setup

1. Clone the repository and enter it.
2. Copy `backend/.env.example` to `backend/.env` and replace every placeholder. Never commit `.env` files.
3. Install and prepare the API:

   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate dev
   npm run start:dev
   ```

4. In another terminal, install and start the web app:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Open <http://localhost:5173>.

The Vite development server proxies `/api` to `http://localhost:3000`. Set `VITE_API_URL` only when the API is hosted elsewhere.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma |
| `GROQ_API_KEY` | Yes | API credential for the AI provider |
| `GROQ_BASE_URL` | No | OpenAI-compatible endpoint; defaults to Groq |
| `AI_MODEL` | No | Provider model identifier |
| `CORS_ORIGIN` | No | Allowed web origin; defaults to local Vite |
| `PORT` | No | API port; defaults to `3000` |
| `VITE_API_URL` | No | Browser-visible API origin for non-proxied builds |

## Docker Compose

Copy the root example and supply strong local credentials before starting:

```bash
cp .env.example .env
docker compose up --build
```

The web app is available at <http://localhost:5173> and the API at <http://localhost:3000/api/v1>.

## Verification

Run the following in both `backend` and `frontend`:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Backend integration tests require the `DATABASE_URL` database to be reachable.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/analyses` | Start an analysis |
| `GET` | `/api/v1/analyses` | List analyses |
| `GET` | `/api/v1/analyses/:id` | Read an analysis |
| `DELETE` | `/api/v1/analyses/:id` | Delete an analysis |

Only public HTTP(S) targets are accepted. Local/private network addresses and URLs containing embedded credentials are rejected.

## Contributing

Open an issue before substantial changes. Keep pull requests focused, do not add generated build output or environment files, and run the full verification commands above. Never include real credentials in issues, fixtures, documentation, or commits.

## Security

If a credential is exposed, revoke it with its provider and replace it immediately; deleting it from the latest revision does not remove it from history. Report vulnerabilities privately to the repository owner rather than opening a public issue.

## License

[MIT](LICENSE)
