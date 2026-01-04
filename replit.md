# FinTrack - Personal Finance Tracker

## Overview

FinTrack is a personal finance management application that helps users track expenses, income, and organize transactions by categories. The app provides a dashboard with financial summaries, expense/income management pages, and category organization. Built as a full-stack TypeScript application with React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for type-safe request/response validation
- **Authentication**: Passport.js with local strategy (username/password), session-based using express-session
- **Password Hashing**: Node.js crypto module with scrypt

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema-to-Zod type generation
- **Session Store**: connect-pg-simple for storing sessions in PostgreSQL
- **Schema Location**: `shared/schema.ts` contains all database table definitions

### Key Data Models
- **Users**: Basic authentication with username/password
- **Categories**: Transaction categories with type (expense/income), supports system defaults and user-created
- **Expenses**: User transactions with amount, date, category, payment mode, and description
- **Incomes**: User income records with amount, date, and source

### Build System
- **Development**: Vite with HMR for frontend, tsx for backend
- **Production**: Custom build script using esbuild for server bundling and Vite for client
- **Path Aliases**: `@/` maps to client/src, `@shared/` maps to shared directory

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/  # UI components (layout, ui primitives)
│       ├── hooks/       # Custom hooks (auth, data fetching)
│       ├── pages/       # Route components
│       └── lib/         # Utilities (queryClient, utils)
├── server/           # Express backend
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database operations
│   └── db.ts         # Database connection
├── shared/           # Shared between client/server
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API route definitions with Zod schemas
└── migrations/       # Drizzle migration files
```

## External Dependencies

### Database
- PostgreSQL database (connection via `DATABASE_URL` environment variable)
- Drizzle Kit for schema migrations (`npm run db:push`)

### Key NPM Packages
- `drizzle-orm` / `drizzle-zod`: Database ORM and Zod integration
- `express-session` / `connect-pg-simple`: Session management
- `passport` / `passport-local`: Authentication
- `@tanstack/react-query`: Data fetching and caching
- `react-hook-form` / `@hookform/resolvers`: Form handling
- `zod`: Schema validation (shared between client/server)
- `recharts`: Dashboard charts
- `date-fns`: Date formatting

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SESSION_SECRET`: Express session secret (defaults to "default_secret" if not set)