# SBA Tracking - Full-Stack Questionnaire System

A complete full-stack questionnaire system built with Next.js, Prisma, and Neon PostgreSQL database.

## 🚀 Features

- ✅ **Next.js 14** with App Router
- ✅ **Prisma ORM** with PostgreSQL (Neon)
- ✅ **TypeScript** for type safety
- ✅ **TailwindCSS** for styling
- ✅ **Dynamic Routes** for questionnaire reviews
- ✅ **API Routes** for data operations
- ✅ **Real-time Status Updates**
- ✅ **Responsive Design**

## 🏗️ Architecture

### Database Schema
```prisma
model Questionnaire {
  id              String   @id @default(cuid())
  createdAt       DateTime @default(now())
  name            String
  email           String
  phone           String
  eventId         String   @unique
  entrepreneurAtHeart  String
  goalWithLaunching     String
  interestInSolarBusiness String
  desiredMonthlyRevenue String
  helpNeededMost        String
  currentMonthlyIncome  String
  priorityReason        String
  investmentWillingness String
  strategyCallCommitment String
  status          String?
}
```

### API Endpoints
- `POST /api/questionnaire` - Create new questionnaire
- `POST /api/status-update` - Update questionnaire status
- `GET /review/[id]` - View questionnaire review page

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
1. Create a Neon PostgreSQL database at [neon.tech](https://neon.tech)
2. Copy your database connection string
3. Create a `.env.local` file:
```env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
```

### 3. Database Migration
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Start Development Server
```bash
npm run dev
```

## 📝 Usage

### Creating a Questionnaire
Send a POST request to `/api/questionnaire` with the following JSON payload:

```json
{
  "name": "Don Jessop",
  "email": "donwayne220@gmail.com",
  "phone": "(385) 455-3967",
  "eventId": "grav-questionnaire-donwayne220@gmail.com-1753126492842",
  "entrepreneurAtHeart": "Yes",
  "goalWithLaunching": "I want to take my current solar business from side-gig to full time wealth generating machine",
  "interestInSolarBusiness": "I want experts to grind for me and build me a wildly successful solar biz from scratch",
  "desiredMonthlyRevenue": "$25,000",
  "helpNeededMost": "I have done door to door for 5 years and got screwed over by a sales company and installer...",
  "currentMonthlyIncome": "$2.5k - $5k/mo",
  "priorityReason": "Because I've been trying to do this on my own for five years!...",
  "investmentWillingness": "Yes - I have the cashflow to invest in myself",
  "strategyCallCommitment": "Yes - I have double checked my calendar and will commit 100% to the time I choose"
}
```

Response:
```json
{
  "success": true,
  "id": "clx1234567890",
  "reviewUrl": "/review/clx1234567890",
  "message": "Questionnaire created successfully"
}
```

### Updating Status
Send a POST request to `/api/status-update`:

```json
{
  "eventId": "grav-questionnaire-donwayne220@gmail.com-1753126492842",
  "status": "Qualified Show-Up"
}
```

Valid status values: `"Qualified Show-Up"`, `"No Show"`, `"Disqualified"`

### Viewing Questionnaire
Navigate to `/review/[id]` where `[id]` is the questionnaire ID returned from the creation API.

## 🎨 Design System

The system uses a custom design system with:
- **Neon Orchid** (#DA70D6) - Primary accent color
- **Sunset Gold** (#FFD700) - Secondary accent color
- **Dark Theme** - Obsidian and charcoal backgrounds
- **Glow Effects** - Subtle neon glows for premium feel

## 📁 Project Structure

```
sba-tracking/
├── app/
│   ├── api/
│   │   ├── questionnaire/
│   │   │   └── route.ts          # POST /api/questionnaire
│   │   └── status-update/
│   │       └── route.ts          # POST /api/status-update
│   ├── review/
│   │   └── [id]/
│   │       └── page.tsx          # Dynamic review page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   └── QuestionnaireCard.tsx     # Review card component
├── lib/
│   └── prisma.ts                 # Prisma client
├── prisma/
│   └── schema.prisma             # Database schema
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
```env
DATABASE_URL="your-neon-production-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
```

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 