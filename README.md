Project Management SaaS

A collaborative project and task management SaaS built with Next.js, Prisma and Stripe. The app includes user authentication, project/task CRUD, real-time updates (websockets), and Stripe subscription handling and webhooks.

## Features

- Email/password registration and login (NextAuth)
- Project and task management (projects -> tasks)
- Real-time task updates via sockets
- Stripe subscriptions and webhook processing
- Prisma ORM for database access
- API routes organized under `app/api/*`

## Tech Stack

- Framework: Next.js (App Router)
- Database ORM: Prisma
- Authentication: NextAuth
- Payments: Stripe
- Language: TypeScript
- Hosting: Vercel (recommended)

## Repository Structure (key paths)

- `app/` — Next.js app routes, pages, and API routes
- `src/lib/` — helpers for `prisma`, `auth`, `stripe`, `socket` and permissions
- `src/prisma/` — Prisma schema
- `src/commponent/` — front-end components (`ProjectList`, `TaskBoard`, `TaskColumn`)
- `src/hooks/` — `useSocket` hook

## Prerequisites

- Node.js 18+ or supported version for your Next.js setup
- pnpm, npm, or yarn
- A database (Postgres, MySQL or SQLite) configured for Prisma
- Stripe account (for subscription and webhook testing)

## Environment Variables

Create a `.env` file in the project root with at least the following variables:

- `DATABASE_URL` — your database connection string
- `NEXTAUTH_URL` — e.g. `http://localhost:3000`
- `NEXTAUTH_SECRET` — random secret for NextAuth
- `STRIPE_SECRET_KEY` — your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key (client)

If you use Postgres or another DB, run Prisma migrations after configuring `DATABASE_URL`.

## Setup & Development

1. Install dependencies:

```bash
npm install
# or
pnpm install
```

2. Set environment variables as described above.

3. Initialize Prisma (generate client & run migrations):

```bash
npm run prisma:generate
npm run prisma:migrate
```

There is a `setup-prisma.sh` script in the repo that can help with initial DB setup — inspect and adapt before running.

4. Run the development server:

```bash
npm run dev
```

Open http://localhost:3000

## Stripe Webhooks (local testing)

- Use the Stripe CLI to forward webhooks to your local `/api/webhooks/stripe/route` endpoint.
- Set `STRIPE_WEBHOOK_SECRET` to the signing secret provided by the Stripe CLI when you forward events.

Example:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe/route
```

## Real-time (Socket) Notes

- The project contains `src/lib/socket.ts` and `src/hooks/useSocket.ts`. Ensure your deployment supports the socket implementation you use (serverless platforms may need adaptations).

## Running Tests

No tests are included by default. Add your test framework (Jest, Vitest) and test scripts if you want CI coverage.

## Deployment

- Recommended: Vercel. Configure environment variables in the Vercel dashboard.
- Ensure database and Stripe webhooks are set correctly for production.

## Contributing

- Fork the repo and create feature branches for changes.
- Open PRs with clear descriptions and relevant screenshots or logs.

## Troubleshooting

- If Prisma client errors occur, run `npx prisma generate` and re-run migrations.
- Check `app/api/*` routes when debugging server-side logic or webhooks.

## Next Steps / Ideas

- Add E2E tests and CI pipeline
- Improve role-based permissions in `src/lib/permissions.ts`
- Add organization / multi-tenant support

## License

This repository does not include a license file. Add one (e.g., `MIT`) if you plan to open-source it.

---

If you want, I can also:

- add a short Quick Start section with exact commands for macOS
- create example `.env.example`
- prepare a simple Vercel deployment guide

Tell me which of those you'd like next.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
