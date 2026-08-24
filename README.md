# HotelPipe
Hotel Full CRM controler


#Folder Structure
hotelpipe/
│
├── apps/
│   ├── server/                          # Express backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma            # All DB models
│   │   │   └── migrations/              # Auto-generated
│   │   │
│   │   ├── src/
│   │   │   ├── index.ts                 # Entry point
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── env.ts               # All env variables
│   │   │   │   └── prismaClient.ts      # Prisma singleton
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   ├── hotel.ts             # Hotel CRUD
│   │   │   │   ├── lead.ts              # Lead management
│   │   │   │   ├── followup.ts          # Follow-up sequences
│   │   │   │   ├── whatsapp.ts          # Webhook receiver
│   │   │   │   └── dashboard.ts         # Metrics endpoints
│   │   │   │
│   │   │   ├── controllers/
│   │   │   │   ├── hotelController.ts
│   │   │   │   ├── leadController.ts
│   │   │   │   ├── followupController.ts
│   │   │   │   ├── whatsappController.ts
│   │   │   │   └── dashboardController.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── whatsappService.ts   # Send/receive WhatsApp
│   │   │   │   ├── leadService.ts       # Lead logic
│   │   │   │   ├── followupService.ts   # Sequence engine
│   │   │   │   ├── excelService.ts      # Excel import parser
│   │   │   │   └── aiService.ts         # Claude API calls
│   │   │   │
│   │   │   ├── jobs/
│   │   │   │   └── followupJob.ts       # node-cron daily job
│   │   │   │
│   │   │   └── middleware/
│   │   │       ├── errorHandler.ts
│   │   │       └── auth.ts              # Basic auth middleware
│   │   │
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── prisma.config.ts
│   │
│   └── web/                             # Next.js frontend
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx                 # Redirect to dashboard
│       │   │
│       │   ├── (auth)/
│       │   │   ├── login/
│       │   │   │   └── page.tsx
│       │   │   └── register/
│       │   │       └── page.tsx
│       │   │
│       │   └── dashboard/
│       │       ├── layout.tsx           # Sidebar + header
│       │       ├── page.tsx             # Main metrics overview
│       │       ├── leads/
│       │       │   ├── page.tsx         # All leads table
│       │       │   └── new/
│       │       │       └── page.tsx     # Manual lead entry form
│       │       ├── followups/
│       │       │   └── page.tsx         # Follow-up status view
│       │       ├── import/
│       │       │   └── page.tsx         # Excel import page
│       │       └── settings/
│       │           └── page.tsx         # Hotel profile + WhatsApp setup
│       │
│       ├── components/
│       │   ├── ui/                      # Reusable UI components
│       │   │   ├── Button.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Table.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Badge.tsx
│       │   │   └── Modal.tsx
│       │   │
│       │   ├── dashboard/
│       │   │   ├── MetricsCard.tsx      # Single stat display
│       │   │   ├── LeadsChart.tsx       # Leads over time chart
│       │   │   ├── ConversionChart.tsx  # Conversion rate chart
│       │   │   └── RecentLeads.tsx      # Latest 5 leads table
│       │   │
│       │   ├── leads/
│       │   │   ├── LeadsTable.tsx       # Full leads list
│       │   │   ├── LeadRow.tsx          # Single lead row
│       │   │   ├── LeadStatusBadge.tsx  # Color-coded status
│       │   │   ├── AddLeadForm.tsx      # Manual entry form
│       │   │   └── LeadDetail.tsx       # Lead detail modal
│       │   │
│       │   ├── followups/
│       │   │   ├── FollowupTable.tsx    # Follow-up queue
│       │   │   └── FollowupStatus.tsx   # Day 1/3/7 indicator
│       │   │
│       │   ├── import/
│       │   │   └── ExcelUpload.tsx      # Drag and drop upload
│       │   │
│       │   └── layout/
│       │       ├── Sidebar.tsx
│       │       ├── Header.tsx
│       │       └── MobileNav.tsx
│       │
│       ├── lib/
│       │   ├── api.ts                   # Axios instance + all API calls
│       │   └── utils.ts                 # Helper functions
│       │
│       ├── types/
│       │   └── index.ts                 # Shared TypeScript types
│       │
│       ├── .env.local
│       ├── .env.example
│       ├── package.json
│       ├── next.config.ts
│       └── tsconfig.json
│
├── .gitignore
└── README.md
