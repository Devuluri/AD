# 🌿 Vaidya Sahay AI (वैद्य सहाय AI)
> **Next-Generation AI Healthcare Platform & Clinical Companion**  
> *Developed for the MASQUERADE '26 AI Chatbot Competition*

![Tech Stack](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-SQLite-16a34a)
![Gemini API](https://img.shields.io/badge/Google-Gemini%20API-4285f4)

---

## 📌 Platform Overview
**Vaidya Sahay AI** transforms from an ordinary conversational chatbot into an intelligent, personalized, next-generation AI healthcare platform. Engineered for the **MASQUERADE '26 AI Chatbot Competition**, it unites empathetic multi-turn clinical triage, diagnostic report interpretation, longitudinal health monitoring, pharmacological intelligence, and family health management.

---

## 🏆 Signature Feature: AI Medical Report Explainer & Longitudinal Comparison Engine

Unlike legacy symptom checkers that only handle text conversations:
1. **Multimodal Diagnostic Parser**: Extracts structured biomarkers from CBCs, Lipid Profiles, Metabolic Panels, and HbA1c tests.
2. **Clinical Reference Interval Checks**: Cross-references every measured value against standard medical intervals (`Normal`, `Borderline`, `Attention Needed`, `Critical Red-Flag`).
3. **Longitudinal Progress Delta Engine**: Selects two diagnostic reports from different dates (e.g. Month 1 vs Month 3), calculates the exact percentage change (`+/- %`), determines clinical trajectory (`Improved`, `Attention`, `Stable`), and synthesizes physician collaboration advice.

---

## 🚀 Key Platform Innovations

| Feature | Description | Real-World Clinical Value |
| :--- | :--- | :--- |
| **⭐ Medical Report Explainer & Comparison** | AI-driven biomarker extraction + longitudinal comparison with delta percentages. | Demystifies lab jargon and shows patients whether treatment is working over time. |
| **📊 Personal Health Risk Dashboard** | Live vital logging (BP, HR, Glucose, SpO2, Temp, Weight) + Habit Intelligence. | Early warning indicator for hypertensive, diabetic, or respiratory deviations. |
| **💊 Medicine Intelligence System** | Pharmacological catalog detailing indications, side effects, precautions, and food clashes. | Prevents accidental Acetaminophen double-dosing and harmful drug-food interactions. |
| **📅 Personal Health Timeline** | Unified chronological stream of symptoms, vitals, lab reports, and consultations. | Eliminates scattered records and provides an instant longitudinal health picture. |
| **👨‍👩‍👧 Multi-Profile Family Health Vault** | Consent-backed profile switcher (Self, Elderly Parent, Pediatric Child, Spouse). | Prevents cross-contamination of family health records on shared devices. |
| **🧠 Ask Past Health Conversations** | Natural language memory query: *"What symptoms did I report about my fever?"* | Allows patients to review self-reported symptoms and timelines accurately. |
| **📄 SBAR Doctor Intake Summary** | 1-Click standardized clinical intake sheet ready for hospital consultation. | Saves 10 minutes of intake questioning at the clinic. |
| **🗣️ Multilingual Voice Engine** | Speech-to-text dictation + Text-to-speech with English, Hindi (हिंदी), and Telugu (తెలుగు) support. | Empowers non-literate and regional-language patients across rural India. |

---

## 🌐 API Architecture

### Core Endpoints:
- `POST /api/chat`: Contextual multi-turn dialogue with Gemini and clinical triage engine.
- `POST /api/chat/history-query`: Semantic search over past conversations.
- `GET /api/profiles` & `POST /api/profiles`: Consent-protected family member profiles.
- `GET /api/vitals` & `POST /api/vitals`: Biomarker tracking with automatic severity evaluation.
- `POST /api/reports/analyze`: AI extraction and layman translation of lab values.
- `POST /api/reports/compare`: Longitudinal delta comparison between two reports.
- `GET /api/medicines`: Pharmacological knowledge search.
- `GET /api/timeline` & `POST /api/timeline`: Chronological health events feed.
- `GET /api/health`: Platform status and uptime.

---

## 💻 Quick Start & Running Live

```bash
# Install dependencies
npm install

# Initialize Prisma SQLite database
npx prisma db push

# Run development server
npm run dev

# Or build for production
npm run build
npm run start
```

Access the application in your browser at:  
👉 **http://localhost:3000**

---

## 🛡️ Medical Safety & Ethical AI Guardrails
- **No Definitive Diagnosis**: Strictly advises that insights are assistive and educational.
- **Red-Flag Escalation**: Automatically surfaces emergency hotlines (`112` / `108`) for acute symptoms (chest pain, dyspnea, stroke signs).
- **Patient Privacy**: Operates on local SQLite storage with consent controls and GDPR/DISHA compliant data deletion rights.
