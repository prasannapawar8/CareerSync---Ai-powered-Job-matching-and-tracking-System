# CareerSync (ApplyPilot) 🚀

CareerSync is a modern, AI-powered workspace designed to supercharge your job search process. It seamlessly combines a drag-and-drop application tracking Kanban board with AI tools to help you track opportunities, parse your resume, and instantly generate highly tailored cover letters. 

## ✨ Key Features

- **Application Tracking Board**: A beautiful, drag-and-drop Kanban board to organize jobs by status (Saved, Applied, Interviewing, Offered, Rejected).
- **Chrome Extension Web Clipper**: Found a great job on LinkedIn or Indeed? Save it directly to your Kanban board without leaving the page using our custom Chrome Extension.
- **AI Cover Letter Generator**: Generate highly personalized cover letters in seconds. The AI automatically analyzes the specific job description and your latest uploaded resume to highlight your most relevant skills.
- **Resume Parsing**: Upload your resume in PDF format. CareerSync will automatically parse and store the text to be used across your AI tools.
- **Modern Tech Stack**: Built with a focus on performance, aesthetics, and modern React 19 / Next.js 15 App Router architecture.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI & Styling**: React 19, Tailwind CSS, custom semantic theming (Light/Dark mode)
- **Database & ORM**: [PostgreSQL (Neon)](https://neon.tech/), [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v5](https://next-auth.js.org/) (Credentials)
- **AI & LLMs**: [Groq](https://groq.com/) for blazing fast OSS model inference (via OpenAI SDK), utilizing Llama 3 models.
- **Drag & Drop**: `@dnd-kit/core`

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine. You will also need a PostgreSQL database (like Neon, Supabase, or a local Postgres instance).

### 2. Clone and Install
Clone the repository and install the dependencies:
```bash
git clone <your-repo-url>
cd applypilot
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
# Database (Prisma)
DATABASE_URL="postgres://user:password@host/database"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-string-here"

# AI Integration (Groq API Key for blazing fast Llama 3 inference)
GROQ_API_KEY="gsk_your_groq_api_key_here"
```

### 4. Database Setup
Sync the database schema using Prisma:
```bash
npx prisma generate
npx prisma db push
```

### 5. Start the Server
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 🧩 Installing the Chrome Extension Web Clipper

To use the Web Clipper to save jobs directly from external sites to your Kanban board:

1. Start your local CareerSync server (`npm run dev`) and log in.
2. Navigate to your **Dashboard**. Under the **Web Clipper Extension** section, click **Generate API Token** and copy the token.
3. Open Google Chrome and navigate to `chrome://extensions/`.
4. Turn on **Developer mode** (the toggle switch in the top right corner).
5. Click the **Load unpacked** button in the top left.
6. Select the `chrome-extension` folder located inside this project directory.
7. Click the new CareerSync extension icon in your Chrome toolbar.
8. Paste the API Token you copied earlier and click **Save Token**.
9. You can now visit job postings (e.g., on LinkedIn) and click the extension icon to instantly save them to your board!

## 📝 License
MIT License
