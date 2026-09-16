# ReviewBot — Backend

The API layer for **ReviewBot**, an AI-powered GitHub pull request reviewer. It authenticates users, forwards analysis requests to the AI engine, and persists the resulting reports.

> **This is 1 of 3 services.**
> [🖥️ Frontend](https://github.com/shubhutf/codereview-ai-frontend) · ⚙️ **Backend** (you are here) · [🧠 AI Engine](https://github.com/shubhutf/codereview-ai-engine)

---

## What this service does

1. **Authenticates** every incoming request using Clerk middleware — unauthenticated requests are rejected before any work happens
2. **Proxies** PR analysis requests to the Python AI engine
3. **Persists** returned reports to MongoDB, scoped to the requesting user
4. **Serves** each user's analysis history back to the frontend

It contains **no AI logic** — it's a thin, stateless layer between the browser and the engine, plus a database.

---

## Architecture

```
Frontend  ──▶  Backend  ──▶  AI Engine
                  │
                  ▼
              MongoDB
```

---

## Tech stack

| | |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB + Mongoose |
| Auth | Clerk (`@clerk/express`) |
| HTTP client | Axios |

---

## API

All routes are mounted under `/api/Reports` and require an authenticated Clerk session.

### `POST /api/Reports/create`
Runs a new analysis. Forwards the PR URL to the AI engine, saves the result, and returns it.

**Request**
```json
{ "pr_url": "https://github.com/owner/repo/pull/123" }
```

**Response**
```json
{
  "success": true,
  "data": {
    "UserID": "user_xxx",
    "Metadata": { "PRUrl": "https://github.com/owner/repo/pull/123" },
    "Issues": [
      {
        "file": "src/app.js",
        "line": 42,
        "code": "const x = y + 1;",
        "issue": "y is undefined",
        "fix": "Define y before using it",
        "type": "bug",
        "severity": "high"
      }
    ],
    "risk_score": 72,
    "risk_summary": "...",
    "final_summary": "..."
  }
}
```

### `GET /api/Reports/AllReports`
Returns the authenticated user's past reports (metadata, risk score and summary only), newest first.

### Report by ID
Returns a single full report, scoped to the authenticated user. Returns `404` if the report doesn't exist or belongs to someone else.

### `GET /`
Health check — returns `Server is Live`.

---

## Data models

| Model | Purpose |
|---|---|
| `PRReport` | A completed PR analysis: metadata, issues, risk score, summaries |
| `User` | User records |
| `History` | Activity history |
| `PageReport` | Page-level report records |
| `RefreshToken` | Token storage |

---

## Getting started

### Prerequisites
- Node.js 18+
- A [MongoDB Atlas](https://cloud.mongodb.com) cluster (or local MongoDB)
- A [Clerk](https://clerk.com) application
- A running instance of the [AI engine](https://github.com/shubhutf/codereview-ai-engine)

### Install

```bash
npm install
```

### Configure

Create a `.env` file in the project root:

```dotenv
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/codereview-ai
CLERK_SECRET_KEY=sk_test_your_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
PYTHON_URL=http://localhost:8000/analyze
```

| Variable | What it's for |
|---|---|
| `PORT` | Port to listen on (defaults to `5000`) |
| `CLIENT_URL` | Frontend origin, used for CORS — must match exactly |
| `MONGO_URI` | MongoDB connection string |
| `CLERK_SECRET_KEY` | Clerk secret key, read automatically by `@clerk/express` |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `PYTHON_URL` | Full URL of the AI engine's analyze endpoint |

> `.env` is gitignored. Never commit real keys.

### Run

```bash
node index.js
```

You should see:
```
App is listening to the port:5000
MongoDb connected:...
```

---

## Deployment

Deploys cleanly to **Render**, **Railway**, or any Node host. After deploying:

1. Set all environment variables in the host's dashboard
2. Update `CLIENT_URL` to the deployed frontend URL
3. Update `PYTHON_URL` to the deployed AI engine URL
4. Note that the engine can take tens of seconds to respond on large PRs — check your host's request timeout

---

## Roadmap

- [ ] Implement billing (Stripe is a dependency but unused)
- [ ] Rate limiting per user
- [ ] Remove unused dependencies (Cloudinary, Redis)

---

## License

MIT
