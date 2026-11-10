# SAFEFRAME — Incident Intelligence & Privacy Protection Platform

> **«“Turn scattered evidence into a clear, privacy-protected incident record.”»**  
> *“AI helps organize what happened. You remain in control of what gets shared.”*

---

## 1. Project Overview & Hackathon Positioning

**SAFEFRAME** is an AI-powered Incident Intelligence and Privacy Protection platform designed primarily for women’s safety. 

Traditional women’s safety apps rely on reactive panic buttons, sirens, GPS trackers, or invasive facial recognition concepts. However, during and after stressful safety encounters, the primary real-world obstacle is **evidence fragmentation**: a victim or witness is left with scattered phone photos, screenshots, disjointed text messages, fuzzy timestamps, and traumatic memory gaps. Retelling the story or presenting documentation to counselors, ombudspersons, HR, or community advocates is overwhelming and emotionally taxing.

**SAFEFRAME solves this by transforming scattered evidence into a structured, chronological, privacy-shielded incident record that the user fully controls.**

---

## 2. Critical Safety & Ethical Boundaries

SAFEFRAME strictly enforces clear boundaries against vigilantism and unconsented surveillance:

- **Zero Facial Recognition or Biometric Indexing**: SAFEFRAME never searches, identifies, or matches faces across public or private databases.
- **No Identity Speculation or Accusations**: The platform never labels someone as "guilty", "criminal", or "dangerous".
- **Strictly Non-Invasive Context**: Multimodal AI extracts only safe environmental cues (e.g., lighting, street signage, pedestrian layout, weather) and never infers protected attributes (race, religion, health, sexuality).
- **No Automated Police Dispatch**: Records are never automatically sent to law enforcement. The user decides if, when, and with whom records are shared.
- **Documentation Support Only**: SAFEFRAME does not replace emergency dispatchers (911), legal advice, or professional trauma counseling.

---

## 3. Product Features & The User Journey

```
COLLECT ➔ UNDERSTAND ➔ ORGANIZE ➔ PROTECT ➔ PACKAGE ➔ CONTROLLED SHARING
```

### 1. Multi-Step Incident Documentation
- Guided creation with explicit reassurance: *"You can skip anything you are uncomfortable providing."*
- Multi-format evidence intake: Photos, screenshots, documents, contemporaneous observational notes, and timeline events.

### 2. AI Incident Intelligence (Powered by Gemini 3.8 Flash)
- **Neutral Incident Summarization**: Generates an objective, non-judgmental synthesis grounded strictly in user-supplied facts.
- **Safe Environmental Context Extraction**: Detects public infrastructure, ambient lighting, and landmarks without speculating on individual identities.
- **Information Gap Prompts**: Respectfully highlights missing timeline sequences (e.g., *"Approximate departure time missing"*) to assist memory consolidation.

### 3. Chronological Incident Timeline (Signature Feature)
- Visual chronological sequence correlating user-reported notes and media upload timestamps.
- Clear distinction between `User-reported` and `AI-organized` milestones.
- Full inline editing, milestone addition, and evidence linking.

### 4. "What Changed?" Intelligence
- Real-time audit trail comparing record revisions.
- Visual breakdown of **Newly Added (+)**, **Updated (~)**, and **Removed (-)** evidence and timeline data.
- Visual before/after state comparison proving active data synthesis.

### 5. Interactive Privacy Shield
- Protects unrelated bystanders, phone numbers, email addresses, and vehicle identifiers before export.
- Interactive controls: **Blur**, **Redact**, **Keep**, and **Undo**.
- Add custom redaction bounding boxes anywhere on images.
- Instant before/after preview: **Original** vs. **Privacy Protected**.
- 4-point Privacy Review checklist ensuring intentional review.

### 6. Evidence Connections Graph
- Relational map demonstrating how photos link to timestamps, narrative milestones, observational notes, and the synthesized dossier.

### 7. Evidence Pack Generator
- Generates high-fidelity, print-ready dossiers formatted for counselors, legal advocates, or personal archives.
- Includes unique SAFEFRAME incident ID (`SF-2026-00421`), timestamps, redaction verification receipts, and responsible AI disclaimers.
- Multi-format exports: Printable PDF view (`window.print()`), structured JSON, and Markdown.

### 8. Controlled Sharing
- Explicit rejection of dangerous "Share Everything" buttons.
- Checkbox-by-checkbox selector: choose exactly what leaves the platform (Summary, Timeline, Evidence, Notes, Location, Date/Time, Protected Images).
- Generates unique Share Package IDs with cryptographic verification digests.

### 9. 30-Second Hackathon Demo Mode
- Instant 1-click evaluation loading fictional incident: `"Unwanted Following Near Campus"`.
- Pre-populated with realistic documentary assets, chronological milestones, privacy redactions, and change logs.

---

## 4. Technology Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Motion.
- **Backend**: Node.js, Express.js proxy with Vite development server integration.
- **AI Engine**: `@google/genai` TypeScript SDK utilizing `gemini-3.8-flash` on server-side with structured JSON schemas (`Type.OBJECT`, `Type.ARRAY`).
- **Security & Privacy**:
  - API keys strictly confined to server-side environment variables (`process.env.GEMINI_API_KEY`).
  - No client-side key leakage.
  - Client-side canvas masking with transparent disclosure of assistive capabilities.
- **Storage**: Browser `localStorage` persistence with revision history audit logs.

---

## 5. Getting Started & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd safepack-incident-intelligence
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory (based on `.env.example`):
```bash
# GEMINI_API_KEY: Injected automatically in Google AI Studio
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### 3. Run Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 6. Limitations & Responsible Disclosure

- **Assistive Guide, Not Guaranteed Anonymity**: The Privacy Shield is an assistive workspace. Users must visually verify blurred regions before sharing.
- **Simulated Analysis Fallback**: If an API key is not yet configured or network is offline, SAFEFRAME applies an explicit server-side baseline analysis clearly labeled: *"Simulated AI Analysis"*.
- **No Emergency Dispatch**: In situations of active physical danger, users are advised to contact local emergency services immediately.

---

## 7. Future Scope & Roadmap

1. **Campus Safety Portals**: Direct, encrypted transmission to university ombudsperson and Title IX advocate offices.
2. **Workplace Incident Organization**: Secure chronological documentation for HR compliance and hostile workplace reporting.
3. **Multilingual Indian Languages**: Support for incident narration across Hindi, Tamil, Bengali, Telugu, and Marathi.
4. **Privacy-Preserving Analytics**: Differential privacy aggregation to alert municipalities to hazardous transit corridors without exposing individual victims.

---

## 8. Hackathon Submission Notes

Built for the Google AI Studio Women's Safety & AI Hackathon.  
SAFEFRAME prioritizes technical credibility, ethical safety boundaries, exceptional design, and user agency over cliché panic buttons.
