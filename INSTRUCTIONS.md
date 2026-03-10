# Setup Instructions

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in **at minimum**:

- `DATABASE_URL` — Neon PostgreSQL connection string ([neon.tech](https://neon.tech))
- `SMTP_EMAIL` / `SMTP_PASSWORD` — for OTP emails
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — for the seed script (step 4)

## 3. Push the schema to the database

```bash
npm run db:push
```

This reads `lib/db/schema.ts` and creates all tables/enums directly in your Neon DB.

> Alternatively, run the generated migration instead:
> `npm run db:migrate`

## 4. Seed the superadmin user

```bash
npm run db:seed
```

Uses `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env.local`.

## 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Log in at `/login` with your superadmin credentials.

---

## Other Useful Commands

| Command | Description |
|---|---|
| `npm run db:studio` | Open Drizzle Studio (visual DB browser) |
| `npm run db:generate` | Generate a new migration after schema changes |
| `npm run db:push` | Push schema changes directly (skips migrations) |
| `npm run db:flush` | **⚠️ Drops everything** — nukes the DB and recreates the public schema |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |