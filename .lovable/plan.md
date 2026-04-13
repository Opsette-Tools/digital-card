

## Business Card Builder — Implementation Plan

### Pages & Routing
- **Builder Page** (default): Form + live preview + action buttons
- **Shared Card View**: When URL hash contains card data, show read-only card with "Save Contact" and "Copy Link" buttons

### Core Components

1. **CardForm** — All input fields (name, title, business, phone, email, website, Instagram, Facebook, address, photo upload). Accent color picker + card style selector (Modern/Clean/Bold). "Try Demo" button fills realistic sample data, "Clear" button resets.

2. **CardPreview** — Live-updating business card with 3 styles:
   - **Modern**: Dark header with accent color, light body
   - **Clean**: All white, accent color borders/accents
   - **Bold**: Full accent color background, white text
   - Shows uploaded photo/logo, contact details as tappable Lucide icons

3. **ActionBar** — Four buttons: Copy Link, Download Image, Download vCard, Save

4. **SharedCardView** — Read-only card display with Save Contact + Copy Link buttons

### Key Features
- **Image upload**: File input → base64 → localStorage
- **Copy Link**: Encode card JSON → base64 → URL hash (`#data=eyJ...`)
- **Download Image**: `html-to-image` to capture card as PNG
- **Download vCard**: Generate `.vcf` with FN, ORG, TEL, EMAIL, URL, ADR, social URLs
- **localStorage**: Save/load single card on demand
- **PWA**: `vite-plugin-pwa` with manifest, service worker, installable (with iframe/preview guards per Lovable requirements)

### Design
- Max-width 480px, centered, mobile-first (375px primary target)
- Subtle gradient background behind the card
- Card with shadow, rounded corners, smooth style transitions
- 44px minimum touch targets
- Empty form on load, "Try Demo" for sample data

### Dependencies to Install
- `html-to-image` — card screenshot
- `vite-plugin-pwa` — PWA support

