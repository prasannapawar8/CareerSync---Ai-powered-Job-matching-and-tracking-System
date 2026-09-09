# CareerSync (ApplyPilot) — Project Specification & Feature Documentation

> **AI-Powered Personalized Job Portal, Intelligent Resume Matcher & Application Management System**

---

## 📌 Executive Summary

**CareerSync (ApplyPilot)** is an end-to-end, AI-powered career assistant and job application management platform. It streamlines the entire job search lifecycle—from parsing resumes, discovering and scoring matching job opportunities, and clipping jobs directly from external web pages via a Chrome Extension, to generating highly tailored, context-aware cover letters and tracking application stages on an interactive Kanban board.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15 (App Router)** & **React 19** | Modern server/client component architecture with streaming and optimized rendering. |
| **Styling & Theming** | **Tailwind CSS v4** & Semantic CSS Tokens | Clean, modern UI with built-in light/dark theme switching support. |
| **Authentication** | **NextAuth.js v5 (Beta)** | Secure session management, Credentials provider, password encryption using `bcryptjs`. |
| **Database & ORM** | **PostgreSQL (Neon DB)** & **Prisma ORM** | Relational schema modeling with Prisma client code generation and connection pooling. |
| **AI / LLM Engine** | **Groq SDK / OpenAI Compatible API** | High-speed LLM inference (Llama 3 / OSS models) for skill extraction and cover letter generation. |
| **Resume Parser** | **pdf-parse** | Server-side PDF parsing and extraction of raw text content from uploaded resumes. |
| **Drag & Drop** | **@dnd-kit (Core & Sortable)** | Accessible, physics-based drag-and-drop state management for the Kanban board. |
| **External Job Search API** | **Adzuna API** | Real-time live job search index queryable by role, skills, and geographic location. |
| **Browser Extension** | **Chrome Extension (Manifest V3)** | Web Clipper with DOM content script extraction and secure API token authentication. |

---

## 🌟 Core Features & Modules

### 1. 🔐 User Authentication & Account Management
- **Credentials-based Signup & Sign-in**: Secure account registration and login flows with hashed passwords (`bcryptjs`).
- **Session Protection**: Route protection via NextAuth session validation in server components and API routes.
- **Extension Token Provisioning**: One-click generation of high-entropy cryptographic API tokens (`crypto.randomBytes`) for authenticating external tools (e.g., Chrome Extension) without exposing user passwords.

---

### 2. 📄 Intelligent Resume Ingestion & Parsing Engine
- **PDF Upload Pipeline**: Drag-and-drop or file-picker upload for candidate resumes in `.pdf` format.
- **Raw Text Extraction**: Automated extraction of unstructured resume text using `pdf-parse`.
- **AI Skill Tagging (`extractResumeSkills`)**:
  - Leverages LLMs to extract the top 8 core hard skills, frameworks, and tools from the uploaded text.
  - Built-in fallback heuristic parser to handle offline/fallback conditions gracefully.
- **Persistent Storage**: Resume text and metadata are saved and linked directly to the user's account for multi-session reuse.

---

### 3. 🎯 Resume-Based Personalized Job Matching
- **Live Opportunity Retrieval**: Queries the Adzuna job search API using the candidate's top extracted skills.
- **Relevance Match Scoring (0–100%)**:
  - Computes a dynamic matching percentage based on the intersection between candidate skills and the job's title/description.
  - Displays matched skills tags (`Matched: TypeScript, React, Next.js`) on each opportunity card.
- **One-Click Save to Pipeline**: Candidates can review matched listings and instantly bookmark them into their tracking board with pre-calculated match scores.

---

### 4. 📋 Interactive Kanban Application Tracker
- **5-Stage Pipeline Workflow**:
  1. `SAVED` — Bookmarked jobs from search or clipped from the web.
  2. `APPLIED` — Submitted applications.
  3. `INTERVIEWING` — Active screening and interview rounds.
  4. `OFFERED` — Received job offers.
  5. `REJECTED` — Unsuccessful applications.
- **Drag-and-Drop State Sync**: Fluid column-to-column drag transitions powered by `@dnd-kit` with optimistic UI updates and instant database persistence (`PATCH /api/jobs/[id]`).
- **Application Controls**: Delete applications, view external source links, and trigger contextual AI actions.

---

### 5. ✍️ AI-Powered Cover Letter Generator
- **Dual-Context Synthesis**: Simultaneously feeds both the candidate's parsed resume and the specific target job description into the LLM.
- **Role-Tailored Pitching**: Emphasizes the candidate's relevant project experience and technical strengths that match the job description's specific requirements.
- **One-Click Generation & Copy**:
  - Modal UI embedded inside the Kanban board cards.
  - Formats clean, professional paragraphs ready for immediate application submission.
  - Instant clipboard copy button.

---

### 6. 🌐 Chrome Extension Web Clipper (Manifest V3)
- **Omnichannel Job Clipping**: Clip job listings from LinkedIn, Indeed, Glassdoor, or any company career page directly to the user's Kanban board.
- **Automated Metadata Extraction**:
  - Content script (`content.js`) parses page title, company name, and job URL.
  - Fallback string tokenizer handles varying tab title formats (`"Role at Company | Site"`).
- **Secure Token Integration**: Stores the user's unique API token in `chrome.storage.local` and validates against the backend (`/api/jobs/clip`) via Bearer Authentication.
- **CORS-Enabled Ingestion Endpoint**: Dedicated API route accepting authenticated cross-origin payloads.

---

### 7. 🎨 UI/UX & Design System
- **Responsive Layout**: Designed for seamless usage across desktop, tablet, and mobile displays.
- **Light & Dark Mode**: Persistent theme toggle supporting dark and light color palettes using CSS variable tokens.
- **Micro-Interactions**: Clean card elevations, drag overlays, and badge indicators for match scores.

---

## 🗄️ Database Schema & Data Models

```prisma
// Users and Authentication
model User {
  id             String     @id @default(cuid())
  name           String?
  email          String     @unique
  emailVerified  DateTime?
  image          String?
  password       String?
  extensionToken String?
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  accounts       Account[]
  sessions       Session[]
  resumes        Resume[]
  savedJobs      SavedJob[]
}

// Uploaded Resumes
model Resume {
  id          String     @id @default(cuid())
  fileName    String
  rawText     String     @db.Text
  uploadedAt  DateTime   @default(now())
  userId      String
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  matchedJobs SavedJob[]

  @@index([userId])
}

// Job Applications & Tracked Jobs
model SavedJob {
  id          String    @id @default(cuid())
  title       String
  company     String
  location    String?
  description String    @db.Text
  applyUrl    String
  matchScore  Float?
  status      JobStatus @default(SAVED)
  savedAt     DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  resumeId    String?
  resume      Resume?   @relation(fields: [resumeId], references: [id])

  @@index([userId])
  @@index([status])
}

enum JobStatus {
  SAVED
  APPLIED
  INTERVIEWING
  OFFERED
  REJECTED
}
```

---

## 🔌 API Routes Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/[...nextauth]` | NextAuth session authentication (Sign-in / Sign-out / Session check). | No |
| `POST` | `/api/upload` | Uploads PDF resume, extracts raw text, and saves to database. | Yes (Session) |
| `POST` | `/api/ai/cover-letter` | Generates a tailored cover letter using the job description and user resume. | Yes (Session) |
| `POST` | `/api/jobs/save` | Saves a recommended job from the match list into the user's tracking board. | Yes (Session) |
| `POST` | `/api/jobs/clip` | Ingests job bookmarks clipped via the Chrome Extension. | Yes (Bearer Token) |
| `PATCH` | `/api/jobs/[id]` | Updates the pipeline status (`SAVED`, `APPLIED`, etc.) of a specific job. | Yes (Session) |
| `DELETE` | `/api/jobs/[id]` | Removes a tracked job from the user's board. | Yes (Session) |
| `POST` | `/api/extension/token` | Generates a new extension API token for the authenticated user. | Yes (Session) |

---

## ⚙️ Environment Variables Configuration

Create a `.env` file in the root of the project with the following keys:

```env
# Database (PostgreSQL via Neon / Supabase / Local)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-character-random-secret"

# AI Inference (Groq or OpenAI Compatible Endpoint)
GROQ_API_KEY="gsk_your_groq_api_key_here"

# Job Search Provider (Adzuna API)
ADZUNA_APP_ID="your_adzuna_app_id"
ADZUNA_APP_KEY="your_adzuna_app_key"
ADZUNA_COUNTRY="in" # Country code (e.g., in, us, gb)
```

---

## 📁 Directory Structure Overview

```text
applypilot/
├── app/
│   ├── (app)/
│   │   ├── dashboard/page.tsx      # Main application dashboard (Upload, Kanban, Tokens)
│   │   └── jobs/page.tsx           # Personalized job matching and search results
│   ├── api/
│   │   ├── ai/cover-letter/        # AI cover letter generator API
│   │   ├── auth/                   # NextAuth endpoint
│   │   ├── extension/token/        # API token generator for Chrome Extension
│   │   ├── jobs/                   # Job saving, status update, deletion, and clipping APIs
│   │   └── upload/                 # PDF Resume upload and parsing API
│   ├── login/                      # User login page
│   ├── register/                   # Account registration page
│   ├── layout.tsx                  # Root layout with theme and session providers
│   └── globals.css                 # Global styling and CSS theme variables
├── chrome-extension/
│   ├── manifest.json               # Chrome Extension Manifest V3 configuration
│   ├── popup.html / popup.js       # Extension popup UI and background sync logic
│   └── content.js                  # Content script for parsing web page metadata
├── prisma/
│   └── schema.prisma               # Prisma relational schema definitions
├── src/
│   ├── components/
│   │   └── ui/                     # UI components (KanbanBoard, CoverLetterModal, FileUpload, etc.)
│   ├── lib/
│   │   ├── auth.ts                 # NextAuth configuration and credentials logic
│   │   ├── openai.ts               # Groq/OpenAI client configuration
│   │   └── prisma.ts               # Prisma singleton client instance
│   └── services/
│       ├── resume-parser/          # PDF text extraction utilities
│       └── scraper/                # Skill extraction & Adzuna job search matching engine
└── package.json                    # Project dependencies and run scripts
```

---

## 🚀 Quick Start Guide

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Sync Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Load Chrome Extension**:
   - Navigate to `chrome://extensions/` in Google Chrome.
   - Enable **Developer mode**.
   - Click **Load unpacked** and select the `chrome-extension` folder.
   - Generate an API token from your CareerSync Dashboard and connect the extension.
