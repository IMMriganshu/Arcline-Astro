# Arcline — Architecture & Design Agency (Astro Re-creation)

A high-fidelity editorial architecture studio website built with **Astro**, **TypeScript**, and **Tailwind CSS**, featuring pixel-perfect scroll choreography and micro-interactions.

---

## 🚀 Quick Start (Running Locally)

### 1. Prerequisites
Ensure you have **Node.js 18.17.0+** (or Node 20+) installed on your machine.
- Verify with: `node -v`

---

### 2. Install Dependencies
Open your terminal inside the project directory and run:

```bash
npm install
```

*(You can also use `pnpm install` or `yarn install` if preferred).*

---

### 3. Start the Development Server
Run the local dev server:

```bash
npm run dev
```

The site will be available at:
👉 **`http://localhost:3000`**

---

### 4. Build for Production
To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📂 Project Structure

```text
├── astro.config.mjs         # Astro configuration & Tailwind Vite plugin
├── package.json             # Scripts & dependencies
├── tsconfig.json            # TypeScript configuration
├── public/
│   ├── favicon.svg          # Arcline 3-bar brand icon
│   └── images/              # High-res project assets (.webp)
└── src/
    ├── components/
    │   ├── Logo.astro              # Architectural 3-bar logo mark
    │   ├── Header.astro            # Sticky nav, Home & Pages 2-column dropdowns
    │   ├── Hero.astro              # Oversized masked "Arcline" typography
    │   ├── AboutSection.astro      # Studio philosophy & asymmetric photo grid
    │   ├── ServicesSection.astro   # Selected services with large faint numerals
    │   ├── PortfolioSection.astro  # "Recent Works" pinned scroll animation
    │   ├── VideoShowcase.astro     # Featured villa showcase with cinema modal
    │   ├── TestimonialSection.astro# Interactive client carousel & crossfade
    │   ├── BlogSection.astro       # Editorial articles grid
    │   ├── ProjectCTA.astro        # High-contrast photography bridge
    │   ├── Footer.astro            # Pre-footer banner & giant wordmark
    │   ├── ScrollToTop.astro       # Floating utility control
    │   ├── ContactModal.astro      # Working inquiry dialog
    │   ├── Button.astro            # Pill button component
    │   └── SectionLabel.astro      # Gold dash + uppercase label
    ├── data/
    │   └── siteData.ts             # Central typed data for projects, services, articles
    ├── layouts/
    │   └── BaseLayout.astro        # Shell with SEO tags, Urbanist font, Schema.org
    ├── pages/
    │   ├── index.astro             # Main homepage
    │   ├── about.astro             # Studio background & team
    │   ├── services.astro          # Comprehensive capabilities
    │   ├── projects.astro          # Built monographs & portfolio
    │   ├── blog.astro              # Architectural perspectives
    │   ├── style-guide.astro       # Design system tokens & typography
    │   └── 404.astro               # Custom 404 page
    ├── scripts/
    │   └── animations.ts           # Central GSAP entrance animations
    └── styles/
        └── global.css              # Urbanist typography & Tailwind styles
```

---

## 🎨 Key Features

- **"Recent Works" Pinned Scroll**: Pinned scroll track where *"Wo"* and *"rks"* separate horizontally, revealing Project 01 (*Coastal Villa*) in a center slit, expanding to full width, followed by sequential stacking of *Green Residence*, *Heritage Museum*, and *Housing Complex*.
- **Interactive Pages Dropdown**: 2-column mega menu under `Pages` replicating the reference navigation.
- **Client Testimonial Carousel**: Interactive rating, slide counter (`01 / 03`), next/prev controls, and client portraits.
- **Editorial Typography**: Styled with Google Font *Urbanist*, zero-pill metadata discipline, and warm gold accents (`#C5A880`).
- **Responsive Across Viewports**: Desktop (1902×944, 1440, 1280), tablet, and mobile.
