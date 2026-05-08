# Student Examination Marking System

A web-based student examination marking system built to help lecturers and administrators manage examination evaluation in a structured way. The system is designed for authenticated users, role-based administration, and clean marking workflows.

## Tech Stack

- TanStack Start
- TanStack Router
- React 19
- TypeScript
- shadcn/ui components
- Tailwind CSS
- Radix UI primitives
- Better Auth
- Drizzle ORM
- Neon PostgreSQL
- Zod
- Vite and Nitro
- Vitest
- ESLint and Prettier
- Hugeicons and Lucide React

## Main Features

- User login and signup
- Protected application dashboard
- Admin user management
- Server-side functions for data operations
- Database schema managed with Drizzle
- Responsive UI styled with shadcn/ui and Tailwind CSS

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create an environment file and set the database connection:

```bash
DATABASE_URL=your_database_url
```

Run the development server:

```bash
pnpm run dev
```

Open the app at:

```bash
http://localhost:3000
```

## Available Scripts

- `pnpm run dev` - start the development server
- `pnpm run build` - build the application
- `pnpm run preview` - preview the production build
- `pnpm run test` - run tests
- `pnpm run lint` - run ESLint
- `pnpm run typecheck` - check TypeScript types
- `pnpm run format` - format source files
