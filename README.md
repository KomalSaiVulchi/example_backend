# JobSeek Backend API

Node.js/Express backend for JobSeek, deployed to Vercel as serverless functions and backed by MongoDB Atlas.

## Features

- Role-based authentication for applicants and companies (JWT + bcrypt)
- REST endpoints for managing jobs, job applications, and user profiles
- Mongoose models with validation and indexes for key collections
- Vercel-optimized setup with cached Mongo connections and rewrites

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and populate:

   ```bash
   cp .env.example .env
   ```

   - `MONGO_URL`: MongoDB Atlas connection string
   - `JWT_SECRET`: Secret used to sign JWT tokens

3. Run the API:

   ```bash
   npm run dev
   ```

   Server listens on `http://localhost:4000` by default.

## Deployment Notes

- `vercel.json` config rewrites all requests to `index.js`, which exports the Express app for the serverless function runtime.
- Mongo connections are cached between invocations to reduce connection churn.
- Ensure production secrets are configured in the Vercel project settings (`MONGO_URL`, `JWT_SECRET`).

## API Overview

- `POST /auth/register` – create applicant or company accounts
- `POST /auth/login` – obtain JWT token
- `GET /jobs` – list jobs (public)
- `POST /jobs` – company-only job creation
- `POST /applications` – applicant submit job application
- `GET /applications/job/:jobId` – company view applications for their job
- `GET /profiles/me` / `PUT /profiles/me` – manage logged-in profile

Refer to route files in `src/routes` for the full contract.
# example_backend
