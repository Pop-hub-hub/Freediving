# Marsa Alam Freedivers — Website (Phase 1)

A complete, responsive marketing website for Marsa Alam Freedivers, built with
plain HTML5, CSS3, and vanilla JavaScript (ES6). No frameworks, no build step,
no backend — open `index.html` and it works.

## Running the project

No installation required.

- **Quickest:** double-click `index.html` to open it in your browser.
- **Recommended (for correct relative paths and live reload):** serve the folder
  with any static server, for example:
  ```bash
  npx serve .
  # or
  python3 -m http.server 5500
  ```
  Then open `http://localhost:5500`.

## Project structure

```
project/
├── index.html          Home
├── about.html           Our story, timeline, values
├── courses.html         All courses, training, specialties, workshops
├── trips.html           Dive packages & ocean/desert activities
├── gallery.html         Filterable photo gallery + lightbox
├── instructors.html     Team profiles
├── faq.html              Full FAQ accordion
├── contact.html          Contact form + info + map placeholder
├── 404.html               Custom not-found page
├── assets/
│   ├── css/
│   │   ├── base.css        Design tokens, reset, typography, layout utilities
│   │   ├── components.css  Navbar, buttons, cards, forms, footer, signature depth-gauge
│   │   ├── pages.css        Page-specific layouts (hero, timeline, contact grid, 404, etc.)
│   │   └── animations.css   Shared keyframes & animation utility classes
│   ├── js/
│   │   └── main.js          All interactive behavior (see below)
│   ├── images/              Drop real photography here
│   ├── videos/              Drop the hero background video here
│   ├── icons/                favicon.svg lives here
│   └── fonts/                 Optional local font files (Google Fonts are loaded via CDN by default)
└── README.md
```

## Design system

- **Colors** — driven entirely by CSS variables in `assets/css/base.css`:
  `--color-primary #003B73`, `--color-secondary #0077B6`, `--color-accent #00B4D8`,
  `--color-bg #F7FBFC`, `--color-light #CAF0F8`, `--color-text #0B1F33`.
- **Typography** — Manrope (display/headings) + Poppins (body), loaded from Google Fonts.
- **Signature element** — the "Depth Gauge": a vertical line that fills as you scroll,
  marking real course depths (0m → 40m). It ties the site's visual identity directly
  to the sport itself, and appears in the hero and can be reused anywhere a course
  progression needs illustrating.

## What `assets/js/main.js` does

Each function only runs if its markup exists on the page, so this one file is safe
to include everywhere:

- `initNavbar` — transparent-to-solid navbar on scroll
- `initMobileMenu` — slide-in mobile navigation
- `initButtonRipple` — ripple effect on `.btn` clicks
- `initScrollReveal` — fade/slide-up reveals via IntersectionObserver (`[data-reveal]`)
- `initBackToTop` — back-to-top button visibility + smooth scroll
- `initAccordion` — FAQ accordion (also used on the home page preview)
- `initGalleryFilter` — category filtering on the gallery page
- `initLightbox` — gallery image lightbox with keyboard navigation
- `initDepthGauge` — animates the signature depth-gauge fill into view
- `initForms` — simulates contact/newsletter submission (see below)
- `initYear` — writes the current year into the footer

## Content still to add (all marked inline)

Search the codebase for `TODO` and `[ ... ]` placeholder labels inside
`media-placeholder` blocks — these mark every spot that needs real photography,
video, instructor bios, and reviews:

- Hero background video/image
- Course, trip, and gallery photography
- Real instructor names, photos, bios, and languages
- Verified guest testimonials (currently sample placeholder quotes)
- Company phone number, email, and exact address
- Google Maps embed on the Contact page
- Workshop and specialty pricing (currently "contact us")

## Phase 2 — booking system & admin dashboard

This build is intentionally structured to make that easy:

- The contact form (`contact.html`) already posts structured fields (course
  interest, dates, message) — swap the `initForms` handler in `main.js` for a
  real API call or booking widget.
- Course, package, and workshop cards use a consistent, repeatable markup
  pattern (`.card`, `.card__body`, `.card__footer`) — ideal for generating
  from a CMS or database instead of static HTML.
- All colors, spacing, and type live in CSS variables in `base.css`, so a
  future admin theme or white-label version only requires editing one file.
- No inline event handlers — every interaction is wired from `main.js`, so
  swapping in real data/state management later won't require touching HTML.

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses `IntersectionObserver`,
`backdrop-filter`, and CSS `clamp()` — all widely supported since 2021.

## Accessibility

- Visible focus states on all interactive elements
- `prefers-reduced-motion` respected (animations disable automatically)
- Semantic landmarks (`header`, `main`, `footer`, `nav`) and heading hierarchy
- Alt/label text included on all form fields and icon-only buttons
