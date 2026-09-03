# RaiseIt 🚀
## AI-Powered Civic Issue Reporting & Resolution Platform

RaiseIt connects citizens with municipal authorities through an AI-assisted reporting flow (vision classification + geospatial recurrence detection + deterministic priority scoring) and a grounded Civic Assistant powered by Retrieval-Augmented Generation (RAG).

---

## 🏛️ System Architecture

```text
                     RAISEIT
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ↓               ↓                ↓
 Citizen Mobile    Authority Web    Admin Web
  React Native      React + Vite     React + Vite
   Expo + TS          Tailwind         Tailwind
        │               │                │
        └───────────────┼────────────────┘
                        ↓
                 Node.js Backend
                 Express + TypeScript
                        │
        ┌───────────────┼────────────────┐
        ↓               ↓                ↓
     MongoDB        AI Service        Storage
  (2dsphere Geo)   Python FastAPI  (Cloudinary /
                        │           Local Uploads)
                ┌───────┴────────┐
                ↓                ↓
          VisionClassifier      RAG
          (Civic Issues)      ChromaDB
                                 │
                                 ↓
                                LLM
```

---

## 🧠 The Two Core Intelligent Capabilities

### Intelligent Capability 1: Issue Detection & Recurrence Prioritization
1. **Vision Classification**: Citizen takes/uploads an image. The `VisionClassifier` analyzes the defect and returns the category (`pothole`, `garbage`, `streetlight`, `water_leakage`, `drainage`, `damaged_infrastructure`) and confidence score.
2. **Transparent Confirmation & Manual Fallback**: The citizen confirms the AI category or manually overrides it if incorrect (preventing AI errors from blocking reports).
3. **Geospatial Recurrence Detection**: Backend queries MongoDB using `$nearSphere` on a `2dsphere` index to locate previous reports in the same category within a configurable 500-meter radius over the last 30 days.
4. **Deterministic Priority Engine**:
   $$\text{Priority Score} = \text{Base Category Weight} + \text{Confidence Contribution} + \text{Nearby Count Contribution} + \text{Recency Bonus}$$
   Mapped to:
   - `0 - 39`: **LOW**
   - `40 - 69`: **MEDIUM**
   - `70 - 100`: **HIGH**

### Intelligent Capability 2: Context-Aware RAG Civic Assistant
1. **Verified Knowledge Ingestion**: Reads municipal SOPs, citizen grievance charters, and department regulations from `documents/civic/`.
2. **Semantic Vector Search**: Top-K retrieval (`TOP_K = 5`) matching the citizen's query.
3. **Contextual Awareness**: When opened from a specific report (e.g. `#RI1024`), automatically injects category, status, and department context.
4. **Grounded Generation & Anti-Hallucination**:
   - Synthesizes answers strictly from verified civic documents.
   - Appends explicit citations (Document Name, Department, Section/Page).
   - If documents cannot answer the question reliably, returns:
     > *"I couldn't find sufficient information in the available verified civic documents to answer this question reliably."*

---

## 👥 User Roles & Demo Credentials

| Role | Email | Password | Department / Notes |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@raiseit.gov` | `Password@123` | Full administrative control |
| **Authority** | `roads.officer@raiseit.gov` | `Password@123` | Roads & Infrastructure |
| **Authority** | `sanitation.officer@raiseit.gov` | `Password@123` | Solid Waste & Sanitation |
| **Citizen** | `citizen@example.com` | `Password@123` | Civic reporter account |

---

## 📁 Repository Structure

```text
RaiseIt/
├── mobile/                  # React Native / Expo Citizen Application
│   ├── src/screens/         # Home, ReportFlow, MyReports, Details, Assistant, Nearby, Profile
│   ├── src/services/        # API Client connected to Node backend
│   └── App.tsx              # Tab Navigation + Report Wizard Stack
│
├── web/                     # Authority & Admin Web Application (React + Vite + Tailwind)
│   ├── src/pages/authority/ # Dashboard, Assigned Issues, Priority Locations, Analytics
│   ├── src/pages/admin/     # Admin Dashboard, Authority Approvals, Departments, Categories, RAG Store
│   ├── src/components/      # RAG Civic Assistant modal with verified citations
│   └── src/services/        # Axios API client
│
├── backend/                 # Node.js + Express + TypeScript Backend
│   ├── src/config/          # Constants, 2dsphere DB setup, PriorityConfig
│   ├── src/controllers/     # Auth, Reports, Authority, Admin, AI proxy, RAG proxy
│   ├── src/models/          # User, Department, IssueCategory, IssueReport, IssueUpdate, CivicDocument
│   ├── src/services/        # Priority calculation, Geospatial recurrence, AI proxy
│   └── src/seed/seed.ts     # Automated database seeder
│
├── ai-service/              # Python FastAPI AI & RAG Service
│   ├── app/services/        # VisionClassifier (replaceable pre-trained model interface)
│   ├── app/rag/             # Chunking indexer, semantic retriever, grounded generator
│   └── app/main.py          # FastAPI application entrypoint on port 8000
│
├── documents/civic/         # Verified municipal SOPs, Policies & Citizen Charters
└── .env.example             # Configuration template
```

---

## ⚡ Quick Start Guide

### 1. Start the Python AI Service
```bash
cd ai-service
python -m uvicorn app.main:app --port 8000 --reload
```
*Health check available at: `http://localhost:8000/health`*

### 2. Start the Node.js Backend
```bash
cd backend
# Optional: Seed initial realistic database records (departments, categories, users, clusters)
npm run seed

# Launch backend in development mode
npm run dev
```
*Backend runs on: `http://localhost:5000`*

### 3. Start the Authority & Admin Web Dashboard
```bash
cd web
npm run dev
```
*Open `http://localhost:5173` in your browser. Use the quick demo buttons on the login screen to switch between Roads Officer, Sanitation Officer, Admin, or Citizen.*

### 4. Start the Citizen Mobile Application
```bash
cd mobile
npm run start
```
*Press `w` in terminal for Web preview, or scan QR code with Expo Go on Android/iOS.*

---

## 🧪 Testing & Verification Scenarios

1. **Normal Report**: Submit image evidence with GPS coordinates $\rightarrow$ AI detects Pothole ($94\%$ confidence) $\rightarrow$ Priority calculated $\rightarrow$ Report created in `SUBMITTED` state.
2. **Recurring Issue & Priority Spike**: Report defect within 500m of existing report cluster $\rightarrow$ Recurrence detected $\rightarrow$ Priority escalates to `HIGH` $\rightarrow$ Appears in Authority's "Recurring Issue Hotspots".
3. **AI Fallback & Manual Override**: Citizen can manually select an alternate category if AI misidentifies the issue.
4. **Authority Status State Machine**: Authority progresses status `SUBMITTED` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `ASSIGNED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` with mandatory resolution notes.
5. **RAG Civic Assistant**: Ask "What happens after submitting a complaint?" $\rightarrow$ Receives grounded answer detailing the 5 stages with source citation to *Citizen Complaint Lifecycle & Escalation Charter*.
6. **Anti-Hallucination Guarantee**: Ask "How do I bake a cake?" $\rightarrow$ Returns *"I couldn't find sufficient information in the available verified civic documents to answer this question reliably."* with 0 citations.
7. **Authority Boundary Security**: Authorities are restricted to complaints assigned to their department; cross-department modifications are forbidden.
