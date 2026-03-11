# 🔐 CipherMind

![React](https://img.shields.io/badge/React-1a1a2e?style=flat-square&logo=react&logoColor=00ff88)
![Vite](https://img.shields.io/badge/Vite-1a1a2e?style=flat-square&logo=vite&logoColor=00ff88)
![Claude API](https://img.shields.io/badge/Claude_API-1a1a2e?style=flat-square&logo=anthropic&logoColor=00ff88)
![OWASP](https://img.shields.io/badge/OWASP_Top_10-Applied-00ff88?style=flat-square)
![Status](https://img.shields.io/badge/Status-Phase_1_Live-00ff88?style=flat-square)

> **AI-Powered Cybersecurity Intelligence Platform** — Real-time CVE aggregation, CISA KEV tracking, and Claude-powered threat analysis in a unified operational dashboard.

---

## 🎯 What is CipherMind?

CipherMind aggregates vulnerability intelligence from authoritative sources and applies AI analysis to help security teams prioritize threats faster.

Instead of manually checking NVD, CISA, and threat feeds separately, CipherMind brings everything into a single dashboard with an AI Analyst persona that thinks like a senior SOC/Red Team defender.
```
Data Sources:  NVD (CVEs) · CISA KEV
AI Layer:      Claude API — Senior SOC/Red Team Analyst persona
Frontend:      React + Vite + Tailwind — 5-tab operational dashboard
```

---

## 🖥️ Dashboard — 5 Tabs

| Tab | Description |
|-----|-------------|
| **CVE Feed** | Real-time NVD vulnerability stream with severity filtering |
| **CISA KEV** | Known Exploited Vulnerabilities catalog with ransomware flags |
| **AI Analyst** | Claude-powered threat analysis chat (SOC/Red Team persona) |
| **Threat Intel** | Deep-dive on specific CVEs with AI assessment |
| **Reports** | Exportable threat intelligence summaries (Markdown) |

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────┐
│           React + Vite Frontend                  │
│     CVE Feed · CISA KEV · AI Analyst             │
│     Threat Intel · Reports                       │
└──────┬──────────────┬──────────────┬────────────┘
       │              │              │
  ┌────▼────┐   ┌─────▼──────┐ ┌────▼──────┐
  │  NVD    │   │  CISA KEV  │ │  Claude   │
  │  API    │   │  Catalog   │ │  API      │
  └─────────┘   └────────────┘ └───────────┘
```

---

## 🔒 Security Implementation

| Layer | Implementation |
|-------|---------------|
| **Input Sanitization** | All user inputs sanitized before use — XSS prevention |
| **Input Validation** | CVE ID format validated with regex before API calls |
| **API Key Protection** | Keys in `.env` only — never in source code |
| **Error Handling** | Generic error messages — no internal details exposed |
| **Content Security** | `rel="noopener noreferrer"` on all external links |
| **Rate Limiting** | Message length and history limits on Claude API calls |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Claude API key — [get one here](https://console.anthropic.com)

### Installation
```bash
git clone https://github.com/taissocout/ciphermind.git
cd ciphermind
npm install
cp .env.example .env
# Add your VITE_CLAUDE_API_KEY to .env
npm run dev
```

---

## 🗺️ Roadmap

- [x] **Phase 1** — React + Vite dashboard with 5 tabs
- [x] **Phase 1** — NVD CVE feed with severity filtering
- [x] **Phase 1** — CISA KEV catalog with ransomware detection
- [x] **Phase 1** — Claude AI Analyst chat interface
- [x] **Phase 1** — Threat Intel deep-dive per CVE
- [x] **Phase 1** — Markdown report export
- [ ] **Phase 2** — Node.js + Express backend on Railway
- [ ] **Phase 2** — Scheduled CVE sync with cron jobs
- [ ] **Phase 3** — RAG with vector database for contextual AI memory

---

## 👤 Author

**taissocout** | [GitHub](https://github.com/taissocout) · [LinkedIn](https://linkedin.com/in/taissocout-cybersecurity)

---

*CipherMind is the flagship project of my DevSecOps/AppSec portfolio.*
