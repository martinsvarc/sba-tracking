# SBA Tracking System

A full-stack Next.js application for tracking SBA questionnaire responses with Prisma and Neon PostgreSQL.

## 🚀 Features

- **Questionnaire Management**: Create and track questionnaire responses
- **Status Updates**: Update questionnaire status (Qualified Show-Up, No Show, Disqualified)
- **Dynamic Review Pages**: View individual questionnaires with unique URLs
- **Modern UI**: Clean, responsive design with TailwindCSS
- **Database Integration**: PostgreSQL with Prisma ORM

## 🏗️ Architecture

- **Frontend**: Next.js 14 (App Router), React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Deployment**: Vercel

## 📋 API Endpoints

### POST `/api/questionnaire`
Creates a new questionnaire entry.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "eventId": "unique-event-id",
  "entrepreneurAtHeart": "Yes",
  "goalWithLaunching": "Build a successful business",
  "interestInSolarBusiness": "High interest",
  "desiredMonthlyRevenue": "$10,000",
  "helpNeededMost": "Marketing support",
  "currentMonthlyIncome": "$5,000",
  "priorityReason": "Financial freedom",
  "investmentWillingness": "Yes",
  "strategyCallCommitment": "Yes"
}
```

**Response:**
```json
{
  "success": true,
  "id": "clx123...",
  "reviewUrl": "/review/clx123...",
  "message": "Questionnaire created successfully"
}
```

### POST `/api/status-update`
Updates the status of a questionnaire.

**Request Body:**
```json
{
  "eventId": "unique-event-id",
  "status": "Qualified Show-Up"
}
```

**Valid Status Values:**
- `"Qualified Show-Up"`
- `"No Show"`
- `"Disqualified"`

## 🗄️ Database Setup

### 1. Create Database Table

Run this SQL in your Neon database:

```sql
-- Create the Questionnaire table
CREATE TABLE "Questionnaire" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "entrepreneurAtHeart" TEXT NOT NULL,
    "goalWithLaunching" TEXT NOT NULL,
    "interestInSolarBusiness" TEXT NOT NULL,
    "desiredMonthlyRevenue" TEXT NOT NULL,
    "helpNeededMost" TEXT NOT NULL,
    "currentMonthlyIncome" TEXT NOT NULL,
    "priorityReason" TEXT NOT NULL,
    "investmentWillingness" TEXT NOT NULL,
    "strategyCallCommitment" TEXT NOT NULL,
    "status" TEXT,

    CONSTRAINT "Questionnaire_pkey" PRIMARY KEY ("id")
);

-- Create unique index on eventId
CREATE UNIQUE INDEX "Questionnaire_eventId_key" ON "Questionnaire"("eventId");

-- Create index on createdAt for better query performance
CREATE INDEX "Questionnaire_createdAt_idx" ON "Questionnaire"("createdAt");
```

### 2. Environment Variables

Set these environment variables in Vercel:

- `DATABASE_URL`: Your Neon PostgreSQL connection string
  - Format: `postgresql://username:password@hostname/database?sslmode=require`
  - Example: `postgresql://user:pass@ep-abc123.us-east-1.aws.neon.tech/dbname?sslmode=require`
- `NODE_ENV`: `production`

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Neon PostgreSQL database

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file:
```env
DATABASE_URL="your-neon-connection-string"
NODE_ENV=development
```

### Database Operations
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Open Prisma Studio
npm run db:studio
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Vercel
- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `NODE_ENV`: `production`

## 📁 Project Structure

```
sba-tracking/
├── app/
│   ├── api/
│   │   ├── questionnaire/
│   │   │   └── route.ts
│   │   └── status-update/
│   │       └── route.ts
│   ├── review/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── QuestionnaireCard.tsx
├── lib/
│   └── prisma.ts
├── prisma/
│   └── schema.prisma
├── package.json
├── next.config.js
├── vercel.json
└── README.md
```

## 🔧 Troubleshooting

### Database Connection Issues
- Ensure `DATABASE_URL` is correctly formatted
- Verify SSL mode is set to `require`
- Check that the database exists and is accessible

### Build Errors
- Run `npm run db:generate` to regenerate Prisma client
- Ensure all environment variables are set in Vercel
- Check that the database schema matches the Prisma schema

### Common DATABASE_URL Format
```
postgresql://username:password@hostname/database?sslmode=require
```

## 📝 License

MIT License 