# Project Folder Structure

```
saas-reverse-engineer/
├── docs/
│   ├── architecture.md
│   ├── folder-structure.md
│   ├── database-schema.md
│   ├── api-design.md
│   └── roadmap.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                    # Reusable UI primitives
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── ThemeToggle.tsx
│   │   │   ├── layout/                # Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── DashboardLayout.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── landing/               # Landing page sections
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── FeaturesSection.tsx
│   │   │   │   └── UrlInput.tsx
│   │   │   ├── analysis/              # Analysis result cards
│   │   │   │   ├── ProductSummary.tsx
│   │   │   │   ├── CoreFeatures.tsx
│   │   │   │   ├── CompetitorAnalysis.tsx
│   │   │   │   ├── RevenueModel.tsx
│   │   │   │   ├── ArchitectureView.tsx
│   │   │   │   ├── DatabaseSchema.tsx
│   │   │   │   ├── ApiDesign.tsx
│   │   │   │   └── MvpRoadmap.tsx
│   │   │   └── dashboard/             # Dashboard components
│   │   │       ├── AnalysisCard.tsx
│   │   │       ├── AnalysisHistory.tsx
│   │   │       └── EmptyState.tsx
│   │   ├── hooks/
│   │   │   ├── useAnalysis.ts
│   │   │   └── useTheme.ts
│   │   ├── lib/
│   │   │   ├── api.ts                 # API client
│   │   │   ├── export.ts              # Export utilities
│   │   │   └── formatters.ts          # Data formatters
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── AnalysisPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.ts
│   └── .env.example
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── analyses/
│   │   │   ├── analyses.module.ts
│   │   │   ├── analyses.controller.ts
│   │   │   ├── analyses.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-analysis.dto.ts
│   │   │   │   └── analysis-response.dto.ts
│   │   │   └── entities/
│   │   │       └── analysis.entity.ts
│   │   ├── ai/
│   │   │   ├── ai.module.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── prompts/
│   │   │   │   ├── product-summary.prompt.ts
│   │   │   │   ├── features.prompt.ts
│   │   │   │   ├── competitors.prompt.ts
│   │   │   │   ├── revenue-model.prompt.ts
│   │   │   │   ├── architecture.prompt.ts
│   │   │   │   ├── database.prompt.ts
│   │   │   │   ├── api-design.prompt.ts
│   │   │   │   └── mvp-roadmap.prompt.ts
│   │   │   └── schemas/
│   │   │       ├── product-summary.schema.ts
│   │   │       ├── features.schema.ts
│   │   │       ├── competitors.schema.ts
│   │   │       ├── revenue-model.schema.ts
│   │   │       ├── architecture.schema.ts
│   │   │       ├── database.schema.ts
│   │   │       ├── api-design.schema.ts
│   │   │       └── mvp-roadmap.schema.ts
│   │   ├── fetch/
│   │   │   ├── fetch.module.ts
│   │   │   └── fetch.service.ts
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   │   ├── analyses.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── nest-cli.json
│   └── .env.example
├── .gitignore
├── README.md
└── docker-compose.yml
