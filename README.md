# HotelPipe
Hotel Full CRM controler


## 📂 Project Architecture

```text
hotelpipe/
├── apps/
│   ├── server/                          # Express Backend Service
│   │   ├── prisma/
│   │   │   ├── schema.prisma            # Database schemas & models
│   │   │   └── migrations/              # Auto-generated schema changes
│   │   ├── src/
│   │   │   ├── index.ts                 # Server entry point
│   │   │   ├── config/
│   │   │   │   ├── env.ts               # Environment variable validation
│   │   │   │   └── prismaClient.ts      # Prisma client singleton
│   │   │   ├── routes/
│   │   │   │   ├── hotel.ts             # Hotel profiles CRUD
│   │   │   │   ├── lead.ts              # Lead ingestion & routing
│   │   │   │   ├── followup.ts          # Messaging sequence configs
│   │   │   │   ├── whatsapp.ts          # Meta webhook receiver
│   │   │   │   └── dashboard.ts         # Analytical metrics endpoints
│   │   │   ├── controllers/
│   │   │   │   ├── hotelController.ts
│   │   │   │   ├── leadController.ts
│   │   │   │   ├── followupController.ts
│   │   │   │   ├── whatsappController.ts
│   │   │   │   └── dashboardController.ts
│   │   │   ├── services/
│   │   │   │   ├── whatsappService.ts   # Meta API gateway
│   │   │   │   ├── leadService.ts       # Lead assignment logic
│   │   │   │   ├── followupService.ts   # Sequence automation engine
│   │   │   │   ├── excelService.ts      # Multi-row spreadsheet parser
│   │   │   │   └── aiService.ts         # Anthropic Claude completions
│   │   │   ├── jobs/
│   │   │   │   └── followupJob.ts       # Cron scheduling daemon
│   │   │   └── middleware/
│   │   │       ├── errorHandler.ts      # Catch-all exception handling
│   │   │       └── auth.ts              # Stateless access validation
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── prisma.config.ts
│   │
│   └── web/                             # Next.js Frontend Client
│       ├── app/
│       │   ├── layout.tsx               # Root view layout wrapper
│       │   ├── page.tsx                 # Core entrance routing node
│       │   ├── (auth)/                  # Shared Auth route layout group
│       │   │   ├── login/
│       │   │   │   └── page.tsx
│       │   │   └── register/
│       │   │       └── page.tsx
│       │   └── dashboard/               # Core application interface
│       │       ├── layout.tsx           # Sidebar & top header framework
│       │       ├── page.tsx             # Main performance metrics
│       │       ├── leads/
│       │       │   ├── page.tsx         # Tabular data directory
│       │       │   └── new/
│       │       │       └── page.tsx     # Manual creation view
│       │       ├── followups/
│       │       │   └── page.tsx         # Active pipeline visualizer
│       │       ├── import/
│       │       │   └── page.tsx         # Bulk file ingestion point
│       │       └── settings/
│       │           └── page.tsx         # Channel integration panel
│       ├── components/
│       │   ├── ui/                      # Core base components (Design System)
│       │   │   ├── Button.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Table.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Badge.tsx
│       │   │   └── Modal.tsx
│       │   ├── dashboard/               # Analytical chart blocks
│       │   │   ├── MetricsCard.tsx
│       │   │   ├── LeadsChart.tsx
│       │   │   ├── ConversionChart.tsx
│       │   │   └── RecentLeads.tsx
│       │   ├── leads/                   # Contextual records display
│       │   │   ├── LeadsTable.tsx
│       │   │   ├── LeadRow.tsx
│       │   │   ├── LeadStatusBadge.tsx
│       │   │   ├── AddLeadForm.tsx
│       │   │   └── LeadDetail.tsx
│       │   ├── followups/               # Pipeline execution units
│       │   │   ├── FollowupTable.tsx
│       │   │   └── FollowupStatus.tsx
│       │   ├── import/                  # File streaming widgets
│       │   │   └── ExcelUpload.tsx
│       │   └── layout/                  # Structural wrapper systems
│       │       ├── Sidebar.tsx
│       │       ├── Header.tsx
│       │       └── MobileNav.tsx
│       ├── lib/
│       │   ├── api.ts                   # Centralized HTTP request layer
│       │   └── utils.ts                 # Style merges & formatters
│       ├── types/
│       │   └── index.ts                 # System-wide type definitions
│       ├── .env.local
│       ├── .env.example
│       ├── package.json
│       ├── next.config.ts
│       └── tsconfig.json
│
├── .gitignore
└── README.md
```

