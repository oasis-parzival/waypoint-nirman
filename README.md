# WAYPOINT: India's AI-Powered Trekking Intelligence Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://waypoint-trek.netlify.app/)
[![React](https://img.shields.io/badge/Framework-React%2018-61DAFB)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E)](https://supabase.com/)
[![Groq](https://img.shields.io/badge/AI-Groq%20%7C%20Llama--3-F55036)](https://groq.com/)
[![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7)](https://waypoint-trek.netlify.app/)

<p align="center">
  <img src="https://github.com/oasis-parzival/waypoint-nirman/blob/main/Images/1.jpeg?raw=true" width="30%" alt="Waypoint Hero">
</p>
<p align="center">
  <img src="https://github.com/oasis-parzival/waypoint-nirman/blob/main/Images/6.jpeg?raw=true" width="30%" alt="Waypoint AI Planner">
  <img src="https://github.com/oasis-parzival/waypoint-nirman/blob/main/Images/4.jpeg?raw=true" width="30%" alt="Waypoint Weather">
</p>

Waypoint is a state-of-the-art, AI-powered trekking intelligence platform built for India. It solves the fragmented trekking ecosystem by combining a structured trek database, real-time environmental intelligence, and an AI expedition generator — **The Sentinel** — into a single, cohesive system. Not a travel app. A mission-critical trekking command layer.

---

## 🏔 System Overview

Waypoint operates on a "Neural Expedition Protocol" philosophy. Every module is designed around one principle: **Data over guesswork. Intelligence over improvisation.**

The platform covers the full trekking lifecycle — discovery, planning, real-time safety, and post-trek analysis — with a design language built for explorers who take their mountains seriously.

---

## 🗺 Core Modules

### 1. Discover
<p align="center">
  <img src="https://github.com/oasis-parzival/waypoint-nirman/blob/main/Images/1.jpeg?raw=true" width="30%" alt="Waypoint Hero">
</p>
A unified route intelligence database synchronized across three major Indian trekking regions.

- **Multi-Region Data:** Sahyadri, North India, and North East India
- **Vector Search:** High-performance search with real-time suggestions and region-based filtering
- **Trek Intelligence Cards:** AI-fetched high-fidelity imagery with difficulty ratings, altitude data, and seasonal windows
- **Sustainability Layer:** Seasonal window guidance reduces ecosystem pressure by routing trekkers at the right time of year


### 2. Plan — The Sentinel
<p align="center">
  <img src="https://github.com/oasis-parzival/waypoint-nirman/blob/main/Images/3.jpeg?raw=true" width="30%" alt="Waypoint Hero">
</p>
The heart of Waypoint's AI capability.

- **Expedition Generator:** Input your experience level, dates, and destination — The Sentinel constructs a complete day-by-day expedition plan
- **Groq Integration:** Powered by `llama-3.1-8b-instant` for terrain-aware reconnaissance
- **Outputs:** Safety warnings, checkpoint coordinates, altitude flags, gear requirements, and contingency notes
- **Purpose-Built:** Not a generic LLM wrapper — trained context specifically around Indian terrain and trekking conditions


### 3. Weather Intelligence
Real-time meteorological data for critical trekking zones.
<p align="center">
  <img src="https://github.com/oasis-parzival/waypoint-nirman/blob/main/Images/8.jpeg?raw=true" width="30%" alt="Waypoint AI Planner">
  <img src="https://github.com/oasis-parzival/waypoint-nirman/blob/main/Images/9.jpeg?raw=true" width="30%" alt="Waypoint Weather">
</p>

- **Live Tracking:** Temperature, Wind Speed, Atmospheric Pressure, and Visibility
- **Key Zones:** Manali, Leh, Munnar, and more
- **Glassmorphic Intelligence UI:** Dynamic visual gradients shift based on conditions for instant situational awareness

### 4. SOS Emergency Beacon + Admin Command Terminal
Waypoint's most critical safety infrastructure.
<p align="center">
  <img src="https://github.com/oasis-parzival/waypoint-nirman/blob/main/Images/7.jpeg?raw=true" width="30%" alt="Waypoint Hero">
</p>
- **Zero-Latency Dispatch:** Captures high-precision GPS coordinates on trigger and broadcasts a priority signal instantly
- **Admin Terminal:** Real-time tracking of all signals from `ACTIVE → RESOLVED`
- **Secure Handling:** Signals are encrypted end-to-end with full geolocation visibility for command personnel
- **Security Layer:** Admin terminal is protected by a secondary authentication key


### 5. User Dashboard
Personalized intelligence for the individual explorer.
<p align="center">
  <img src="https://github.com/oasis-parzival/waypoint-nirman/blob/main/Images/10.jpeg?raw=true" width="30%" alt="Waypoint Hero">
</p>
- **Strategy Analysis:** AI module that analyses your completed trek history and generates a high-altitude strategy for upcoming missions
- **Active Vectors:** Ongoing missions and recently synchronized routes
- **Trek Analytics:** Progress tracking across difficulty levels and regions

### 6. Map & Offline Grid
Built for when the network disappears.
<p align="center">
  <img src="https://github.com/oasis-parzival/waypoint-nirman/blob/main/Images/4.jpeg?raw=true" width="30%" alt="Waypoint Hero">
</p>
- **Tactical Maps:** Integrated geospatial interface for precise trail positioning
- **Offline Grid (PWA):** Zero-bandwidth navigation profiles ensuring safety in dead zones — no signal required

### 7. Community & Experiences
The ground intelligence layer.
<p align="center">
  <img src="https://github.com/oasis-parzival/waypoint-nirman/blob/main/Images/6.jpeg?raw=true" width="30%" alt="Waypoint AI Planner">
  <img src="https://github.com/oasis-parzival/waypoint-nirman/blob/main/Images/7.jpeg?raw=true" width="30%" alt="Waypoint Weather">
</p>
- **SOS Feed:** Public awareness feed of active and resolved emergency signals
- **Field Archives:** Visual grid of terrain photos and field logs contributed by trekkers across the network — a living, growing knowledge base for every trail

---

## 🛠 Technical Architecture

Built on a modern **React 18 + Vite** SPA architecture with a fully decoupled backend.

### Frontend
- **Framework:** React 18 + Vite (SPA)
- **Styling:** Tailwind CSS with a custom Alpine Onyx design system
- **Animations:** Framer Motion — 3D card transitions, spring physics, perspective-based geometry
- **Visualization:** Chart.js for operational analytics in the Admin Terminal
- **Routing:** React Router v6

### Backend & Intelligence
- **Platform:** Supabase — Real-time PostgreSQL, Auth, and Object Storage
- **AI Engine:** Groq Cloud API (`llama-3.1-8b-instant`) for The Sentinel and contextual intelligence
- **Real-Time:** Supabase Realtime for live SOS signal propagation to the Admin Terminal

### Design Language
The UI implements the **Alpine Onyx** aesthetic:
- Dark premium interfaces with vibrant mint accent system
- Glassmorphic card components with dynamic gradient states
- 3D stacking interaction cards on the hero using Framer Motion
- Canvas particle network for high-performance background animation

---

## 🌱 Sustainability Architecture

Sustainability is not a feature. It is a foundational design decision.

- **Seasonal Windows:** Each trek in the database carries verified seasonal windows — guiding trekkers toward responsible timing, reducing off-season foot traffic on fragile ecosystems
- **Established Route Prioritization:** The Sentinel's AI routing favors documented, established trails over improvised paths — protecting biodiversity corridors
- **Conservation Dataset:** Every GPS trace, foot traffic pattern, and user-reported condition logged on Waypoint contributes to an anonymized conservation dataset — accessible to forest departments, researchers, and environmental NGOs
- **Data for the Mountains:** Long-term, Waypoint's data layer becomes a living record that protects these trails for future generations

---

## ⚙️ Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/waypoint.git
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Add the following to your `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GROQ_API_KEY=your_groq_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 🚀 Deployment

Waypoint is deployed on **Netlify** with SPA routing handled via `_redirects` configuration — ensuring all React Router paths resolve correctly on direct URL access.

```
/*    /index.html    200
```

Push to `main` → Netlify auto-deploys. No manual pipeline required.

---

## 🛡 Security & Safety Protocol

- Admin Terminal is isolated behind a secondary security key — inaccessible without authorization
- SOS signals are encrypted and handled with absolute integrity from dispatch to resolution
- Supabase Row-Level Security (RLS) enforces data access boundaries across all user tiers

---

## 📸 Screenshots

<p align="center">
  <img src="YOUR_WEATHER_PAGE_SCREENSHOT_URL_HERE" width="49%" alt="Waypoint Weather Intelligence">
  <img src="YOUR_DASHBOARD_SCREENSHOT_URL_HERE" width="49%" alt="Waypoint User Dashboard">
</p>

<p align="center">
  <img src="YOUR_COMMUNITY_SCREENSHOT_URL_HERE" width="49%" alt="Waypoint Community Feed">
  <img src="YOUR_EXPERIENCES_SCREENSHOT_URL_HERE" width="49%" alt="Waypoint Field Archives">
</p>

---

## 🗂 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + Framer Motion |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| AI Engine | Groq Cloud — Llama-3.1-8b-instant |
| Visualization | Chart.js |
| Hosting | Netlify |
| Routing | React Router v6 |

---

*India has over 3,000 trails. Most undiscovered. Most undocumented. All waiting.*

*Built for the peaks. Ascend limitless. Ascend responsibly.*
