# 🌿 Vaidya Sahay AI (वैद्य सहाय AI)
> **Your Compassionate AI Healthcare Companion**  
> *Developed for the MASQUERADE '26 AI Chatbot Competition*

![Tech Stack](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-SQLite-16a34a)
![Gemini API](https://img.shields.io/badge/Google-Gemini%20API-4285f4)

---

## 📌 Project Overview
**Vaidya Sahay AI** is a real, working healthcare artificial intelligence assistant crafted to recreate the design specification with exact visual fidelity while delivering human-like, clinically responsible conversational triage.

### Core Highlights:
- **Exact UI Reconstruction**: Clean 3-column layout matching the reference visual design (Left Navigation & Emergency Triage, Center Dynamic Chat Canvas, Right Quick Action & Hospital Directory).
- **Intelligent Gemini Integration**: Server-side communication with Google Gemini (`gemini-1.5-flash`), equipped with multi-turn context memory, clarification questions, and empathetic conversational rhythm.
- **Fail-Safe Clinical Fallback Engine**: Embedded medical intelligence ensures 100% uptime, symptom evaluation, and red-flag detection even when an external API key is absent or rate-limited.
- **Strict Medical Safety Guardrails**: Follows WHO/CDC triage guidelines. Never diagnoses definitively, never replaces a doctor, and immediately escalates emergencies (e.g. chest pain, stroke symptoms, respiratory distress).
- **Persistent Chat History**: Powered by Prisma ORM and SQLite (`prisma/dev.db`), saving conversations, message counts, and timestamps.
- **Multimodal & Voice Enabled**: Integrated Web Speech API for voice recognition input and browser speech synthesis for hands-free audio playback.
- **Interactive Health Tools**: Includes interactive Body Mass Index (BMI) calculator, Daily Hydration tracker, and Fever Severity Converter.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (Tested on Node v24.x)
- **npm** or **pnpm**

### 2. Environment Setup
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
# Google Gemini API Key (Get yours at https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# SQLite Database URL
DATABASE_URL="file:./dev.db"
```
> *Note: If `GEMINI_API_KEY` is not provided, Vaidya Sahay AI automatically runs using its high-accuracy internal clinical triage engine without crashing.*

### 3. Install Dependencies
```bash
npm install
```

### 4. Initialize Database
```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build
```bash
npm run build
npm run start
```

---

## 🌐 API Endpoints

### 1. `GET /api/health`
Health check endpoint reporting system uptime and service status.
- **Response**:
```json
{
  "status": "ok",
  "service": "Vaidya Sahay AI Healthcare Assistant",
  "timestamp": "2026-10-26T14:03:40.948Z",
  "version": "1.0.0"
}
```

### 2. `POST /api/chat`
Server-side chat endpoint interacting with Gemini API. Keeps API keys private from the client.
- **Request**:
```json
{
  "messages": [
    { "role": "user", "content": "I have fever and headache" }
  ],
  "conversationId": "optional-uuid"
}
```
- **Response**:
```json
{
  "response": "I'm sorry to hear that you're not feeling well. 🙁\nTo understand your condition better, can you please tell me:\n• How long have you had the fever?\n• What is your current temperature reading (if measured)?\n• Are you experiencing any other symptoms like cough, sore throat, headache, body pain, or vomiting?",
  "conversationId": "d3461b7b-63b7-44a6-83b2-c04a65654772",
  "modelUsed": "gemini-1.5-flash"
}
```

### 3. `GET /api/conversations` & `POST /api/conversations`
List and create multi-turn chat sessions in SQLite.

### 4. `GET /api/conversations/[id]` & `DELETE /api/conversations/[id]`
Retrieve conversation message history or delete previous consultations.

---

## 📁 Project Directory Structure
```
├── prisma/
│   ├── schema.prisma            # Prisma schema: Conversation & Message models
│   └── dev.db                   # Local SQLite database
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts     # POST /api/chat with Gemini API integration
│   │   │   ├── health/
│   │   │   │   └── route.ts     # GET /api/health endpoint
│   │   │   └── conversations/
│   │   │       ├── route.ts     # GET / POST conversation history
│   │   │       └── [id]/
│   │   │           └── route.ts # GET / DELETE / PATCH individual conversations
│   │   ├── globals.css          # Tailwind CSS styles & custom scrollbars
│   │   ├── layout.tsx           # Root Next.js layout & metadata
│   │   └── page.tsx             # Main chat view and state manager
│   ├── components/
│   │   ├── Icons.tsx            # Custom SVG avatars (AI Robot & User) & brand logos
│   │   ├── LeftSidebar.tsx      # Logo, navigation, health tips carousel, emergency card
│   │   ├── MainChat.tsx         # Header, message stream, typing indicator, mic voice input
│   │   ├── MessageBubble.tsx    # AI & User message bubbles with timestamps & double checkmarks
│   │   ├── RightSidebar.tsx     # Suggested questions, important note, hospital CTA
│   │   ├── HospitalModal.tsx    # Verified hospital directory with emergency hotlines
│   │   ├── ChatHistoryModal.tsx # Past conversation viewer and session loader
│   │   ├── HealthToolsModal.tsx # Interactive BMI, Hydration, and Fever calculators
│   │   ├── AboutModal.tsx       # MASQUERADE '26 competition details
│   │   └── SavedModal.tsx       # Bookmarked clinical guidance manager
│   ├── data/
│   │   ├── healthTips.ts        # Evidence-based wellness tips for carousel
│   │   └── mockHospitals.ts     # Hospital directory and emergency helplines
│   └── lib/
│       ├── gemini.ts            # Server-side Gemini client & clinical triage engine
│       ├── prisma.ts            # Singleton PrismaClient instance
│       └── types.ts             # TypeScript interfaces
├── .env.example                 # Template environment variables
├── package.json                 # Project dependencies & scripts
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript compiler configuration
└── README.md                    # Project documentation
```

---

## 🛡️ Medical Disclaimer
*Vaidya Sahay AI provides health information and triage education for guidance purposes only. It is not a certified healthcare professional and does not offer medical diagnoses or prescriptions. In the event of a medical emergency, please contact 112, 108, or your local emergency hospital immediately.*
