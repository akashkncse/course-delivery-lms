# Course Delivery LMS

A full-stack Learning Management System built with **Next.js 16**, **Drizzle ORM**, and **Neon PostgreSQL**. Designed for tuition centers, coaching institutes, and independent educators to create, manage, and deliver courses with built-in quizzes, gamification, payments, certificates, and a discussion forum.

> **Live-configurable** — platform name, logo, hero images, testimonials, FAQs, and footer content are all editable from the admin panel. No code changes needed to white-label the platform.

---

## Features

### For Learners
- **Course Catalog** — browse, filter by tags, search, and enroll in courses
- **Lesson Player** — video, document, and image lessons with progress tracking
- **Quizzes & Gamification** — multiple-choice quizzes with attempt-based scoring, points, badge levels, and a global leaderboard
- **Certificates** — auto-generated certificates with unique certificate numbers and a public verification page
- **Course Reviews** — star ratings and written reviews per course
- **Discussion Forum** — threaded discussions with pinning and archiving
- **Profile & Dashboard** — track enrollments, points, badges, and completed courses
- **Invitations** — accept course invitations from instructors

### For Admins / Instructors
- **Admin Dashboard** — overview stats: users, courses, enrollments, completion rates, quiz performance, and trending courses
- **Course Builder** — create courses with drag-and-drop lesson ordering, attach files/links, set visibility (public / signed-in only), and access rules (open / invitation / paid)
- **Quiz Editor** — build quizzes with multiple questions, configurable point tiers per attempt
- **User Management** — create users, assign roles (superadmin / instructor / learner), activate/deactivate accounts
- **Reporting** — per-course analytics: enrollment funnels, completion rates, time spent, quiz stats, review ratings, and 30-day enrollment/completion trends
- **Payment Management** — view all Razorpay transactions with status filters and revenue summary
- **Tag Management** — create and assign tags to courses for catalog filtering
- **Badge Levels** — define gamification badge tiers (e.g., Bronze → Silver → Gold)
- **Site Settings** — configure platform name, logo, hero/featured images, testimonials, FAQs, footer tagline, and footer links from the admin UI
- **Invitation System** — invite specific users to courses by email
- **Participant View** — see per-course enrollment, progress, and completion data

### Platform
- **OTP-based Authentication** — email verification for signup and password reset (via Gmail SMTP)
- **Role-based Access Control** — superadmin, instructor, and learner roles with middleware-enforced route protection
- **Razorpay Payments** — integrated payment flow with order creation, signature verification, and test mode support
- **File Uploads** — Vercel Blob storage for course images, avatars, and lesson attachments
- **Light/Dark Mode** — theme toggle with light mode as default
- **Responsive UI** — built with Radix UI primitives, Tailwind CSS 4, and motion animations
- **Comprehensive REST API** — 50+ endpoints documented in [`API_README.md`](./API_README.md)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, React 19) |
| **Language** | TypeScript 5 |
| **Database** | Neon PostgreSQL (serverless) |
| **ORM** | Drizzle ORM with drizzle-kit migrations |
| **Styling** | Tailwind CSS 4, Radix UI, class-variance-authority |
| **Animations** | Motion (Framer Motion) |
| **Payments** | Razorpay |
| **Email** | Nodemailer (Gmail SMTP) |
| **File Storage** | Vercel Blob |
| **Auth** | Custom session-based with bcrypt + OTP |
| **Theme** | next-themes |
| **Tables** | TanStack React Table |
| **Toasts** | Sonner |

---

## Project Structure

```
├── app/
│   ├── admin/            # Admin panel pages (dashboard, courses, users, settings, …)
│   ├── api/              # REST API route handlers
│   ├── dashboard/        # Learner dashboard pages (courses, leaderboard, discussions, …)
│   ├── login/            # Auth pages
│   ├── signup/
│   ├── verify/
│   ├── forgot-password/
│   ├── layout.tsx        # Root layout with theme provider
│   └── page.tsx          # Public landing page
├── components/
│   ├── landing/          # Landing page sections (hero, stats, features, testimonials, …)
│   └── ui/               # Reusable UI primitives (shadcn/ui)
├── lib/
│   ├── db/
│   │   ├── schema.ts     # Drizzle schema (20+ tables)
│   │   └── index.ts      # Database connection
│   ├── auth.ts           # Session helpers
│   ├── email.ts          # OTP email sender
│   ├── razorpay.ts       # Razorpay client
│   ├── currency.ts       # Currency formatting
│   ├── validation.ts     # Input validation helpers
│   └── utils.ts          # General utilities
├── scripts/
│   ├── seed-admin.ts     # Seed superadmin user
│   └── flush.ts          # Drop and recreate DB (destructive)
├── drizzle/              # Generated migrations
├── middleware.ts          # Route protection middleware
├── INSTRUCTIONS.md        # Quick-start setup guide
├── API_README.md          # Full REST API documentation
└── .env.example           # Required environment variables
```

---

## Database Schema

20+ tables covering the full LMS domain:

- **users** / **sessions** / **otp_codes** — authentication and identity
- **courses** / **tags** / **course_tags** — course catalog
- **lessons** / **lesson_attachments** — content delivery
- **enrollments** / **lesson_progress** — learner progress tracking
- **quizzes** / **quiz_questions** / **quiz_options** / **quiz_attempts** / **quiz_responses** — assessment engine
- **reviews** — course ratings
- **certificates** — completion certificates
- **badge_levels** — gamification tiers
- **course_invitations** — invitation-based access
- **discussion_threads** / **discussion_replies** — forum
- **payments** — Razorpay transaction records
- **site_settings** — admin-configurable platform settings

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **Neon PostgreSQL** database ([neon.tech](https://neon.tech) — free tier works)
- **Gmail account** with an [App Password](https://support.google.com/accounts/answer/185833) for SMTP

### Setup

```bash
# 1. Clone and install
git clone <your-repo-url>
cd course-delivery-lms
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local — set DATABASE_URL, SMTP_EMAIL, SMTP_PASSWORD, etc.

# 3. Push schema to database
npm run db:push

# 4. Seed the superadmin account
npm run db:seed

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in at `/login` with your superadmin credentials.

See [`INSTRUCTIONS.md`](./INSTRUCTIONS.md) for detailed setup notes and additional commands.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `SMTP_EMAIL` | ✅ | Gmail address for sending OTP emails |
| `SMTP_PASSWORD` | ✅ | Gmail App Password |
| `ADMIN_EMAIL` | ✅* | Superadmin email (used by seed script) |
| `ADMIN_PASSWORD` | ✅* | Superadmin password (used by seed script) |
| `RAZORPAY_KEY_ID` | ❌ | Razorpay key (for paid courses) |
| `RAZORPAY_KEY_SECRET` | ❌ | Razorpay secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ❌ | Client-side Razorpay key |
| `BLOB_READ_WRITE_TOKEN` | ❌ | Vercel Blob token (for file uploads) |

\* Required only when running the seed script.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Run generated migrations |
| `npm run db:generate` | Generate a new migration from schema changes |
| `npm run db:studio` | Open Drizzle Studio (visual DB browser) |
| `npm run db:seed` | Seed superadmin user |
| `npm run db:flush` | ⚠️ Drop all tables and recreate schema |

---

## API Documentation

The platform exposes 50+ REST API endpoints covering authentication, courses, lessons, quizzes, enrollments, payments, discussions, certificates, and admin operations.

Full documentation with request/response examples: [`API_README.md`](./API_README.md)

---

## License

This project is licensed under the [MIT License](./LICENSE).