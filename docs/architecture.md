# AI SaaS Reverse Engineer - Architecture

## Overview

A web platform that accepts a SaaS URL and generates a comprehensive reverse-engineering analysis using AI, including product summaries, feature extraction, competitor analysis, revenue models, architecture recommendations, database schemas, API designs, and MVP roadmaps.

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│  Vite + TypeScript + Tailwind CSS + React Query     │
├─────────────────────────────────────────────────────┤
│                   REST API (HTTP)                    │
├─────────────────────────────────────────────────────┤
│                  Backend (NestJS)                    │
│  ┌──────────────┐  ┌──────────────┐                │
│  │  Analysis     │  │  AI Service  │                │
│  │  Module       │  │  (Groq)      │                │
│  └──────────────┘  └──────────────┘                │
│  ┌──────────────┐  ┌──────────────┐                │
│  │  Export       │  │  URL Fetch   │                │
│  │  Module       │  │  Service     │                │
│  └──────────────┘  └──────────────┘                │
├─────────────────────────────────────────────────────┤
│              Prisma ORM + PostgreSQL                 │
└─────────────────────────────────────────────────────┘
```

## Data Flow

1. User enters SaaS URL on landing page
2. Frontend sends URL to backend `/api/analyses` endpoint
3. Backend validates URL, fetches page content
4. Backend sends content to Groq AI for structured analysis
5. AI returns structured JSON with all analysis sections
6. Backend stores result in PostgreSQL
7. Frontend displays analysis results in dashboard
8. User can export results as Markdown or JSON

## Tech Stack Details

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Query (TanStack Query)** for server state
- **React Router** for routing
- **Lucide React** for icons

### Backend
- **NestJS** framework
- **Prisma** ORM
- **PostgreSQL** database
- **class-validator / class-transformer** for DTOs
- **Axios** for HTTP requests
- **Groq SDK** for AI inference

### AI
- **Groq Cloud API** with LLaMA 3.1 70B model
- Structured JSON output via prompt engineering
- Streaming support for progressive results

## Key Design Decisions

1. **Monorepo structure** - Frontend and backend in separate directories under one repo
2. **Server-side AI calls** - Groq API key stays on backend, never exposed to client
3. **Structured prompts** - Each analysis section uses dedicated prompts for accuracy
4. **Persistent storage** - All analyses saved to PostgreSQL for history
5. **REST API** - Simple, well-understood API design
