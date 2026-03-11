# Luxora — AI-Powered Beauty Concierge & Customer Intelligence Platform

Luxora is a prototype demonstrating how an AI shopping concierge can simultaneously **sell products** and **collect actionable customer insights** for brand teams — all within a single conversational experience.

## 🎯 Concept

Instead of traditional post-purchase surveys, Luxora embeds **customer research questions** naturally into the shopping conversation. Every interaction generates structured insights (pain points, praise, suggestions) that are automatically classified and surfaced in a brand admin dashboard.

## 🏗️ Architecture

```
src/
├── App.tsx                    # Root — routing & providers
├── lib/
│   └── store.tsx              # Global state (React Context)
│                                - Chat engine & mock LLM responses
│                                - Feedback classifier (keyword → category)
│                                - Product catalog & mock data
│                                - Insight aggregation logic
├── pages/
│   ├── CustomerApp.tsx        # Customer-facing chat + product sidebar
│   ├── AdminDashboard.tsx     # Brand dashboard — insights, charts, export
│   ├── Index.tsx              # Landing redirect
│   └── NotFound.tsx           # 404
├── components/
│   ├── TopNav.tsx             # Navigation bar (Customer / Admin)
│   ├── DemoToggle.tsx         # Switch between 3 demo personas
│   ├── ProductSidebar.tsx     # Progressive product reveal panel
│   └── NavLink.tsx            # Navigation helper
└── index.css                  # Design tokens & theme
```

## 🔑 Key Features

### Customer App (`/`)
- **AI Concierge Chat** — conversational shopping assistant with embedded customer research questions
- **Progressive Product Discovery** — products appear dynamically as the conversation progresses
- **3 Demo Personas** toggled via bottom bar:
  - **New User** — discovery flow with preference questions
  - **Sarah (Returning)** — post-purchase feedback on product & logistics
  - **Alex (Abandoned)** — re-engagement with objection handling

### Admin Dashboard (`/admin`)
- **Aggregated Insight Feed** — feedback auto-classified into categories (Delivery/Shipping, Pricing, Product Condition, etc.)
- **Severity Levels** — critical / high / medium / low with visual indicators
- **AI-Generated Action Plans** — each category includes a ready-to-deploy resolution suggestion
- **Analytics Charts** — Recharts-powered pie chart (by type) and bar chart (weekly trends)
- **Export to JSON** — download all conversation data, categories, and AI suggestions

### Feedback Classification Engine
Messages are analyzed via keyword matching (simulating LLM classification) and routed to:
- **Pain Points** — shipping delays, damaged products, pricing concerns, UX issues, returns
- **Praise** — product satisfaction, customer service quality
- **Suggestions** — feature requests, shade matching, general feedback

Each category tracks: message count, severity, timestamps, user segment, journey stage, and a suggested action plan.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Animation | Framer Motion |
| Routing | React Router v6 |
| State | React Context |

## 🚀 Getting Started

```bash
npm install
npm run dev
```

## 📝 Notes

- **Frontend prototype** — no backend, no real AI. All responses are scripted.
- The classification engine uses keyword matching as a stand-in for LLM-based analysis.
- Built with [Lovable](https://lovable.dev) for rapid prototyping.
