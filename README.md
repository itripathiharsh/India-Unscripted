# India Unscripted — Curated Subcontinent Expeditions

> Bespoke, raw, and end-to-end travel through the Indian subcontinent for discerning travelers. No tourist buses. No rigid itineraries. Experience India with private trains, royal heritage homestays, and 24/7 on-ground human liaisons.

Live Platform: [https://india-unscripted.vercel.app/](https://india-unscripted.vercel.app/)

---

## Overview

India Unscripted is an ultra-premium, design-forward travel platform celebrating the living heritage, sacred architecture, and untouched geography of the subcontinent. Built with restraint, cinematic precision, and deep negative space, the interface blends traditional Rajput/Mughal architectural aesthetics with modern 60 FPS motion graphics, authentic Survey of India cartography, and real-time telemetry.

---

## Key Modules & Features

### 1. Cinematic Title Sequence
- **Architectural Sanctuary Reveal:** Intricately carved sandstone pillar with stepped plinth mouldings (pitha), fluted shaft relief grooves, Rajasthani corbelled bracket capital, and high-contrast volumetric morning sunbeam.
- **Celestial Astrolabe Compass:** Concentric antique brass orbital degree rings, 72 coordinate graduation ticks (5-degree intervals), sacred lotus petal rosette, and 3D chiseled 8-point celestial star needles with a glowing cabochon jewel flare.
- **Authentic Cartographic Route:** 100% geographically authentic Survey of India boundaries across all 753 districts, rendering a molten-gold cubic Bezier route connecting Ladakh -> Delhi -> Varanasi -> Hampi -> Kerala.
- **Brand Lockup & Promise:** Warm ivory and 24K gold leaf typography (`INDIA UNSCRIPTED · BESPOKE EXPEDITIONS`), transitioning over dawn Himalayan silhouettes with `BEYOND THE ORDINARY`.
- **First-Visit Intelligence:** Session-aware memory (`localStorage` and `sessionStorage`) ensures the sequence plays on first landing, then allows direct access to the live platform on return visits. Replayable anytime via the navigation bar.

### 2. Living Subcontinent Survey (Explore)
- 43 hand-curated sanctuaries, citadels, and landscapes cataloged across 7 geographic zones: North, South, East, West, Central, Northeast, and the Islands.
- Filterable by architectural style, spiritual lineage, wildlife reserves, and remote wilderness.
- Detailed expedition dossier cards with private rail transit links, optimal visiting seasons, and heritage stay recommendations.

### 3. Route Wizard & Dossier Architect (Plan)
- Interactive expedition builder calculating pacing, travel distances, and duration.
- Generates custom day-by-day expedition dossiers with private liaison notes, transit modes (heritage trains, private 4x4s, chartered backwater boats), and estimated disbursements.

### 4. Expedition Reservation (Book)
- Transparent deposit-based reservations (20% deposit model).
- Includes real-time seasonal tiering, private fixer assignments, and dietary/cultural preference configuration.

### 5. Private Concierge Dispatch (Contact)
- Direct liaison communication channel connecting travelers with on-ground fixers stationed in Delhi, Varanasi, Udaipur, Kochi, and Leh.

### 6. Ambient Telemetry & Organic Soundscape
- Live IST dispatch clock, sunrise metrics for Varanasi, and Thar Desert climate telemetry.
- Synthesized organic ambient drone powered directly by the Web Audio API (zero audio file dependencies, fully client-generated).

---

## Project Structure

```
.
├── index.html                  # Flagship luxury experience & cinematic intro
├── explore.html                # 43 Sanctuaries & Citadels catalog
├── plan.html                   # Interactive Route Wizard & Dossier Architect
├── book.html                   # Expedition reservation & deposit checkout
├── contact.html                # Direct Concierge & Liaison dispatch
├── render-intro.html           # Dedicated 1080p standalone broadcast intro renderer
├── server.js                   # Zero-dependency Node server with HTTP 206 range streaming
├── vercel.json                 # Vercel deployment configuration
├── .gitignore                  # Git ignore rules for clean repository state
├── css/
│   ├── unscripted.css          # Primary design system, typography & components
│   ├── intro.css               # Cinematic title sequence styles & responsive rules
│   └── style.css               # Subpage layouts & destination catalog styles
├── js/
│   ├── cinematic-engine.js     # 60 FPS vector + canvas title sequence engine
│   ├── app.js                  # Global application lifecycle
│   ├── ui.js                   # Shared navigation header, audio drone & telemetry
│   ├── data.js                 # 43 curated destinations, coordinates & metadata
│   ├── explore.js              # Destination filtering & theme chips
│   ├── plan.js                 # Route wizard logic & itinerary calculations
│   ├── book.js                 # Booking state & deposit calculator
│   ├── contact.js              # Concierge messaging & dispatch
│   ├── transit-map.js          # Interactive route web
│   ├── scrollytelling.js       # The Six Chapters scrollytelling transitions
│   ├── soundscape.js           # Web Audio API organic ambient drone synthesizer
│   ├── motion-graphics.js      # Canvas particle simulations
│   ├── home.js                 # Homepage telemetry and interactive bindings
│   └── intro.js                # Intro helper bindings
└── assets/
    ├── logo.svg                # Astrolabe compass emblem
    ├── intro/                  # Survey of India cartography JSON, SVG & broadcast MP4
    ├── generated/              # Curated heritage photography & destination plates
    ├── video/                  # Ambient background video loops
    └── img/                    # Regional overview plates
```

---

## Design System & Palette

- **Deep Void / Charcoal:** `#06070a`, `#08090c`, `#141724`
- **Antique Gold / 24K Leaf:** `#c5a059`, `#d4af37`, `#fef08a`, `#b45309`
- **Warm Ivory:** `#f8f6f0`, `#ebe7de`
- **Typography:**
  - Headings & Titles: `Cinzel` (Serif)
  - Editorial Prose: `Playfair Display` (Serif)
  - Body & Clean Copy: `Plus Jakarta Sans` (Sans-Serif)
  - Coordinates & Telemetry: `Space Mono` (Monospace)
- **Zero-Emoji Standard:** All iconography and markings use geometric SVG shapes, unicode rules, and architectural line art.

---

## Local Development

Start the local server with native HTTP 206 Partial Content byte-range support:

```bash
node server.js
```

Open your browser to:

```
http://localhost:4040
```

---

## License

Private and proprietary. All rights reserved by India Unscripted.
