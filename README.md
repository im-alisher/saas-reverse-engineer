# AI SaaS Reverse Engineer

A production-quality platform that analyzes any SaaS URL and generates comprehensive reverse-engineering insights powered by AI.

## Features

- **Product Summary** - Get an overview of any SaaS product
- **Feature Extraction** - Identify core features, workflows, and value propositions
- **Competitor Analysis** - Discover competitors and market positioning
- **Revenue Model** - Analyze pricing models and monetization opportunities
- **Architecture Recommendations** - Get tech stack suggestions
- **Database Schema** - Generate Prisma schema recommendations
- **API Design** - REST endpoint design with DTOs
- **MVP Roadmap** - Development phases, timelines, and milestones
- **Export** - Download results as Markdown or JSON
- **Dark Mode** - Full dark/light theme support

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Query |
| Backend | NestJS, Prisma, PostgreSQL |
| AI | Groq (LLaMA 3.1 70B) |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Groq API key (from [console.groq.com](https://console.groq.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd saas-reverse-engineer
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database URL and Groq API key
   npx prisma generate
   npx prisma migrate dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run start:dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Open** [http://localhost:5173](http://localhost:5173)

### Environment Variables

**Backend** (`backend/.env`):
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saas_reverse_engineer"
GROQ_API_KEY="your-groq-api-key"
CORS_ORIGIN="http://localhost:5173"
PORT=3000
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/analyses` | Create a new analysis |
| GET | `/api/v1/analyses` | List all analyses |
| GET | `/api/v1/analyses/:id` | Get analysis by ID |
| DELETE | `/api/v1/analyses/:id` | Delete an analysis |

## Project Structure

```
saas-reverse-engineer/
├── frontend/          # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # React hooks
│   │   ├── pages/        # Page components
│   │   └── lib/          # Utilities
│   └── ...
├── backend/           # NestJS + Prisma
│   ├── src/
│   │   ├── analyses/     # Analysis module
│   │   ├── ai/           # Groq AI service
│   │   ├── fetch/        # URL fetcher
│   │   └── prisma/       # Database service
│   └── prisma/
│       └── schema.prisma
└── docs/              # Documentation
```

## License

MIT
