# Digital Card — Shrink to What's Real

**Owner:** Ruthnie · **Written:** 2026-07-20 · **Status:** Built 2026-07-20 (awaiting Ruthnie's verify on the new templates, then commit/push across 3 repos)

---

## ✅ Build log — 2026-07-20

All six build-order steps done; digital-card, brand-board, and file-builder all
typecheck clean (`tsc -b --force`, exit 0). Dev server verified running on 8105
(8104 was a stale pre-change server). **Not committed yet** — pending Ruthnie's
verify of the three new templates, then a per-repo commit/push (3 repos).

- **§2c shared fonts** — added `digital-card` to `_shared/fonts/sync.mjs` (lib +
  picker targets) and synced. Contact cards store one pairing `id` in a new
  `CardData.fontId`; `src/lib/fonts.ts` rewritten as the resolver over
  `@/lib/shared-fonts` (`headingStack`/`bodyStack`/`loadCardFont` + a legacy
  `nameFont`/`bodyFont` → pairing migration map). StyleBar uses `OpsetteFontPicker`.
  Font `<link>` injected per selection in `Index.tsx`. Blob carries
  `data.font = { id, heading, body, googleHref }` (mirrors the palette blob).
- **§2b initials** — default `false` in `emptyCard`/`demoCard`; kept only as the
  no-photo avatar fallback; all three avatar blocks render in `headingStack(fontId)`.
- **§2a QR → kit (highest value)** — `toKitJson` bakes `data.qr` (photo-less vCard
  QR PNG, EC 'M', accent-colored, 1024px). Consumer side wired end-to-end:
  brand-board `ingestCardPayload` pulls `qr` → new `cardQrDataUrl` board field
  (embedTools + BoardForm `qrKey` + board.types default + project file); file-builder
  writes `Digital_Card/contact_qr.png`. Optional everywhere so old blobs still parse.
- **§1a cut business cards** — deleted `BusinessCards.tsx`; `CardStyle` drops the 5
  business styles; `BUSINESS_STYLES`/`isBusinessStyle` removed; `print.ts` narrowed
  to `square` + the two handout sizes (bleed/safe guides dropped — `showGuides`
  false everywhere); print-quality export + `PrintCard` now handout-only;
  CardPreview/PrintCard/StyleBar/About cleaned up. `normalizeCard`
  (`src/lib/card-normalize.ts`) coerces a cut business style + migrates fonts on
  reopen / share-decode / localStorage restore.
- **§1c handout untouched, excluded from kit** — its 3 font selects kept on the old
  private list, moved verbatim into `src/lib/handout-fonts.ts`; "Export to Brand
  Board" hidden + guarded for handout style (ActionBar + the embed `saveToBrandBoard`).
- **§3 new templates** — `TypeCard` (minimal/type-forward, no icons), `MonoCard`
  (dark high-contrast), `PhotoCard` (photo-led hero + contact column) appended to
  `VCardTemplates.tsx`; registered in CardStyle union, CONTACT_STYLES, CardPreview,
  PrintCard, StyleBar. All use shared fonts + degrade gracefully. **This is the
  step to review with Ruthnie.**

---

**Original status:** Planned, not built
**Companion docs:** `CARD_CAPTURE_INTEROP.md` (the outbound/inbound handshake), `../../docs/BRAND-KIT-INTEROP-CONTRACT.md`

---

## 0. Why this doc exists — the decision behind it

We interrogated the whole tool and cut it down to what actually earns its place. The
reasoning, so a future session doesn't re-open settled ground:

- **A business card only has value if it's printed.** We are NOT chasing print
  (Vistaprint already wins on templates; a 300-DPI PNG "prints fine" but that doesn't
  make the *design* worth having). A screen-only business card is a solved, valueless
  thing. **→ Cut the business cards.**
- **An image of a contact card is a dead end for the person receiving it** — you can't
  tap an image to save a contact; retyping from a picture is worse than just pasting a
  number. So the visual card is NOT a "share your info" tool.
- **But the visual contact card is NOT useless** — its real job is as a *structured
  identity graphic the OWNER places*: a client drops it on a Facebook page, a slide, a
  PowerPoint, a social post. "Here's your contact info as a clean image, paste it
  anywhere instead of typing it out." Modest, real, kit-appropriate. **→ Keep the
  contact cards.**
- **The functional core is the `.vcf` + the QR.** The QR (encoding the vCard) is the
  ONE asset that isn't a dead end: scan → phone offers to save the contact. This is the
  tap-to-save mechanism. **→ The QR must ship to Brand Board (it currently does not —
  this is the highest-value fix in the whole rethink).**
- **No overlap with Contact Capture.** Verified: Contact Capture is *inbound* (it
  `parseVcard`s / scans OTHER people's cards into your rolodex). Digital Card is
  *outbound* (publish YOUR info). Opposite directions of the same vCard object. They are
  complementary halves of one handshake, not redundant. No merge.

**Net:** Digital Card becomes an honest **contact-card + vCard/QR generator**, not a
business-card template farm with a print pretense.

---

## 1. Scope — what changes

### 1a. CUT: the business-card category (print pretense)
Delete/archive the 5 horizontal business templates and the machinery that only served
them:
- Templates: `MonogramCard`, `WordmarkCard`, `FullBleedCard`, `EditorialCard`, `DarkCard`
  — all of `src/components/cards/BusinessCards.tsx`.
- Types: drop `'modern' | 'clean' | 'bold' | 'minimal' | 'neon'` from `CardStyle`; drop
  `BUSINESS_STYLES` / `isBusinessStyle`. (`src/types/card.ts`)
- Print sizing that only served business cards: `us-business`, `eu-business`, `SIZE_OPTIONS`,
  `showPrintGuides`, bleed guides. Keep only what handouts still need. (`src/lib/print.ts`)
- Print-quality PNG export path in `ActionBar.tsx` (`downloadImagePrint`, the hidden
  `PrintCard` capture portal) — no longer needed once print is out of scope. Web-quality
  PNG stays (that's the "paste-anywhere graphic").
- Update `PrintCard.tsx` template map, `Index.tsx` style picker, `seed.ts` demo data.

> **Decision:** delete, don't hide behind a flag. Ruthnie: "I can't see wanting them back."
> Git history preserves them if ever needed.

### 1b. KEEP + STAR: the contact cards
`ProfileCard`, `SplitCard`, `StackedCard` (`src/components/cards/VCardTemplates.tsx`)
become the primary (and only visual) output. This is where NEW templates go —
Ruthnie wants **3–5 new** genuinely distinct contact-card layouts (she's greedy with
templates; now they're pointed at the one surface that has a use). Design them as
**online identity graphics**, not print: screen-first, gradients/glass fine, portrait or
flexible aspect, legible at small social sizes.

### 1c. Handout — leave in place, stop exporting, don't invest
The handout is a whole second content model bolted onto the card (its own fields:
`headline`, `subheadline`, `blurb`, `ctaLabel`, `ctaUrl`, `handoutVariant` hero/side/corner,
`handoutTheme`, `handoutLogoSize`, `headlineColor`, `qrColor`, plus borrowed
`fullName`/`businessName`/`photo` for the footer). That's why it reads as a different
tool. It likely becomes its **own separate handout tool** later.

For this pass: **do NOT export the handout to Brand Board**, and don't invest in it.
Leave the code in place (untouched), just excluded from the kit flow. No rework.

### 1d. No rename
The tool stays **"Digital Card"** — repo, folder, and the Brand Board import all keep
that name. It's a digital card, not a "business card" or "contact card"; the name is
already correct and renaming would churn the repo, the folder, and the kit import for
nothing.

---

## 2. The three real fixes (do these regardless of new templates)

### 2a. QR → Brand Board  ⭐ highest value
**Today:** `toKitJson` bakes `image` (card PNG) + `vcard` (the `.vcf`) into the
`type:"card"` blob, but **NOT the QR**. (`src/lib/brandKit.ts:52`) So the one scannable,
tap-to-save asset never reaches the client's kit.

**Fix:** bake a **vCard QR PNG** into the blob (new `data.qr` field, `data:image/png`).
- Use the **vCard QR** (encodes contact fields directly), NOT a link QR. Rationale: it
  works forever, offline, no hosting dependency — correct for a kit asset meant to
  outlive any live URL. (A link QR shows the pretty card but dies if the link does.)
- Photo-less vCard for the QR (a vCard-with-photo is too large to scan — already handled:
  `generateVCard()` in `vcard.ts` strips the photo for exactly this reason).
- Brand Board + File Builder already handle multi-asset blobs and read MIME via
  `dataUrlToFile`, so `data.qr` rides in like the existing image. Confirm File Builder
  reconstructs it (e.g. `contact-qr.png`).
- Bump `CardPayload` (`brandKit.ts`) — `data.qr?: string`. Keep it optional so older
  blobs still parse.

### 2b. Initials — default off, and render in the SELECTED font
**Today:** `showInitials` defaults to `true` (`card.ts:82`); several templates stamp
initials as decoration next to the already-spelled-out name (worst offender: the Wordmark
chip, `BusinessCards.tsx:76` — being deleted anyway). Where initials legitimately appear
(no-photo avatar fallback in Profile/Split/Stacked), they render in a hardcoded font.

**Fix:**
- Default `showInitials` → **false** (`emptyCard` + `demoCard`).
- Keep initials ONLY as the **no-photo avatar fallback** — never as name-adjacent
  decoration.
- Render the initials avatar in the **selected heading/name font** (see 2c) instead of a
  hardcoded stack, so it matches the card's typography.

### 2c. Adopt the SHARED font system (kit-interop fix)
**Today:** Digital Card has its own private 7-font list (`src/lib/fonts.ts`, raw string
values), while Palette Studio / Brand Board / Banner Designer share
`src/lib/shared-fonts.ts` + the `opsette-font-picker` component and carry fonts across
the kit boundary as a **pairing `id`**. So a card exported into a brand board does NOT
share the kit's font identity — a real interop hole, not cosmetic.

**Fix:**
- Vendor `_shared/fonts/shared-fonts.ts` into `digital-card/src/lib/shared-fonts.ts`
  (byte-identical copy, via `node _shared/fonts/sync.mjs` — never hand-edit the copy).
- Vendor the `opsette-font-picker` component in.
- Replace Digital Card's `nameFont` / `bodyFont` (and handout `headlineFont` /
  `subheadlineFont` / `blurbFont`) storage with the shared pairing **`id`**; resolve
  heading/body via the shared lib.
- Carry the pairing `id` in the Brand Board blob so the card's fonts match the rest of
  the client's kit.
- This is the enabling change for 2b (initials-in-selected-font) — do it first or
  alongside.
- **Migration:** old saved cards store the legacy string values; map the 7 legacy values
  onto their nearest shared pairing (or fall back to a default) so reopen doesn't break.
  Keep `resolveFontStack` as a compatibility shim if needed.

---

## 3. New contact-card templates — 3 new

Design brief — these are **online identity graphics**, so:
- Screen-first: gradients, glass, soft shadows all fair game (unlike print).
- Must read at small sizes (social thumbnail, slide corner).
- Portrait or flexible aspect; no 3.5×2 business-card shape.
- Use the shared fonts (heading/body pairing).
- No-photo → initials avatar in the heading font.
- Every field optional and degrading gracefully (a card with just name + phone + IG
  should still look composed).

Starting directions (the 3 kept templates — Profile / Split / Stacked — plus 3 new,
designed alongside Ruthnie in the build session):
1. **Minimal type-forward** — no icons, pure typography + the pairing fonts doing the
   work. Reads as premium/editorial.
2. **Mono/dark social** — high-contrast dark card that pops in a feed.
3. **Photo-led** — large photo/initials block anchoring the composition, contact info as
   a clean secondary column.

---

## 4. Explicitly OUT of scope (record so we don't drift back)
- **PDF / print-with-bleed export.** Someday nice-to-have. Vistaprint accepts PNG/JPEG;
  a "real" PDF export does not make the *contact* cards more useful. Do not build now.
- **Business-card templates.** Cut, per §1a. Not coming back.
- **The handout.** Not exported to Brand Board, not invested in; likely a separate tool
  later (§1c). Left in place, untouched.
- **Renaming the tool.** Stays "Digital Card" (§1d).
- **Merging with Contact Capture.** Complementary, not redundant. No merge.

---

## 5. Build order (for the working session)
1. Vendor shared fonts + `opsette-font-picker`; migrate `nameFont`/`bodyFont` → pairing id (§2c).
2. Initials: default off + render in selected font (§2b).
3. QR → Brand Board bake (§2a) + confirm File Builder reconstruction.
4. Cut business cards + print machinery (§1a); clean up types, picker, seed, PrintCard.
5. Exclude the handout from Brand Board export (§1c) — leave its code untouched.
6. New contact-card templates (§3) — design/click-through with Ruthnie.
