# Digital Card ⇄ Contact Capture — Interop Plan

**Owner:** Ruthnie · **Written:** 2026-07-03 · **Status:** Planned, not built

This doc covers TWO things:
1. **The base work** — make Digital Card and Contact Capture behave like one family: a Digital Card QR that lands cleanly, and a Contact Capture scanner that ingests a Digital Card QR natively. This is the minimum, build it first.
2. **Next-level ideas** — genuine, non-cheap differentiators for each app, to pick from *after* the base ships.

---

## 0. What these two apps are (the mental model)

They are the two halves of one networking handshake.

- **Digital Card = the card you hand out.** Your polished, branded card that *other people look at*. Photo, colors, title, socials. The job is to look good and get your info into their phone.
- **Contact Capture = your rolodex.** Where *you* collect everyone else's info at an event — with notes, tags, voice memos, follow-ups. Private, for you. The party trick is scanning a paper card (OCR) or a QR and filing the person away.

The shared language underneath both is **vCard**. Both apps already read/write it. That's what makes them relatable at all.

---

## 1. The problem we're fixing

### 1a. A QR code can only hold two useful things
- **A raw vCard** → phone camera offers "Add to Contacts." Safe, native, one tap — but the person sees a plain gray system card. None of the design. Unimpressive.
- **A link** → opens the beautiful branded card in a browser. Impressive — but a stranger scanning a QR and getting a web page pop open reads as *"why did this open a website?"* in 2026. Slightly suspicious, not smooth.

There is no magic third option built into QR. We get the good half of both by controlling **what the link lands on**.

### 1b. Today's two concrete gaps
- **Digital Card's landing page doesn't lead with the action.** `SharedCardView.tsx` renders the card, but "Save Contact" is just one of three equal buttons in a grid (`Save Contact` / `QR` / `Copy Link`). A stranger who scans lands on a page they have to *poke at*. We want the page to immediately, obviously offer Save Contact.
  - Ref: `src/components/SharedCardView.tsx:54-69`
- **Contact Capture's scanner rejects a Digital Card QR.** Its `parseVcard()` hard-returns `null` on anything that doesn't start with `BEGIN:VCARD`, then the scanner shows *"That's not a Contact Capture QR."* A Digital Card QR is a URL, so it always fails.
  - Ref (contact-capture): `src/lib/parseVcard.ts:18` and `src/components/CardScanner.tsx` (the "not a Contact Capture QR" branch)

---

## 2. The target experience

**One QR, two audiences:**

- **Stranger with just a phone camera** → scans → the branded card opens → the page *immediately* presents a big, obvious **Save Contact** (their phone's native add-contact prompt, with photo + info baked into the vCard so it's NOT a gray card). One tap, done. The pretty card sits right behind it as the "oh, nice" moment.
- **Fellow Opsette user in Contact Capture** → scans in-app → we recognize the Digital Card URL, decode it, map the fields, and file the person straight into their rolodex. No browser at all.

This is the same pattern the paid NFC-card companies (Popl, Blinq) and Apple/LinkedIn use. It's respectable, not a hack.

---

## 3. Base work — Task A: Digital Card landing page leads with Save Contact

**Goal:** when someone lands on a shared card (`#/?data=…`), the page's job is obvious in one glance: save this person.

**Scope (all in `digital-card`):**
- Rework `SharedCardView.tsx` so **Save Contact is the primary, full-width, unmissable action** — not one-of-three in a grid. QR and Copy Link demote to secondary (smaller, or under a "more" affordance). Keep the card preview front and center above it.
- Consider a one-line reassurance under the button (e.g. "Adds their name, number & email to your phone") so the browser-opened moment feels purposeful, not suspicious.
- Make sure the vCard behind "Save Contact" includes the **photo** so the saved contact isn't gray. (Note: the *share URL* excludes photo to keep the URL/QR short — `share.ts:5` — but the card object in `SharedCardView` still has whatever was shared. Photo is dropped from the URL payload, so the shared-view vCard currently can't include a photo. **Decision needed:** either (a) accept no photo on the stranger path, or (b) host the photo somewhere retrievable. Recommend (a) for v1 — keep it simple; the name/number/email landing cleanly is the win.)
- Keep it Ant Design, mobile-first (this is scanned on a phone 100% of the time — design at 375px).

**Do NOT change** the QR itself — it stays a link. That's correct for the camera-scanning stranger.

**Files:** `src/components/SharedCardView.tsx`, possibly `src/lib/vcard.ts` (confirm photo handling).

---

## 4. Base work — Task B: Contact Capture scanner ingests a Digital Card QR

**Goal:** in Contact Capture, scanning a Digital Card QR prefills a contact natively — same flow and feel as scanning a native Contact Capture QR, no OCR fallback.

**Scope (all in `contact-capture`):**
- When the scanner decodes a QR, branch on the payload:
  1. **Starts with `BEGIN:VCARD`** → existing `parseVcard()` path (unchanged).
  2. **Looks like a Digital Card share URL** (contains `digital-card` host AND a `data=<base64>` in the hash) → new path: pull the base64 out of the hash, `atob` + JSON.parse it, and map Digital Card fields → Contact fields.
  3. **Neither** → existing "not a Contact Capture QR" error.
- **New helper** (mirror the existing `parseVcard.ts` style/comments): `parseDigitalCardUrl(input: string): Partial<Contact> | null`. Reuse Digital Card's decode logic conceptually (`atob(decodeURIComponent(...))` → JSON) — see `digital-card/src/lib/share.ts:10-17`.
- **Field mapping** (Digital Card `CardData` → Contact Capture `Contact`):
  | Digital Card | Contact Capture |
  |---|---|
  | `fullName` | `name` |
  | `title` | `position` |
  | `businessName` | `company` |
  | `phone` | `phone` |
  | `email` | `email` |
  | `website` | `website` (strip leading `https?://` to match existing convention) |
  | socials (`instagram`, `linkedin`, …) | *v1: ignore, or fold into a note/tag — decide* |
- Wire the branch into the same `handleQrScanned` → `onParsed(..., source:"qr")` → prefill-form path that vCard uses, so downstream is identical.

**Files:** `src/components/QrScanner.tsx` / `src/components/CardScanner.tsx` (the decode branch), new `src/lib/parseDigitalCardUrl.ts`, reuse the prefill flow in `AddNewScreen.tsx`.

**Gotcha:** the exact Digital Card URL shape is `…/digital-card/#/?data=<base64>`. Match on the presence of `data=` in the hash, not on an exact host string (host differs between local dev and `tools.opsette.io`). Be defensive: return `null` on any decode/parse failure so the "not our QR" error still fires for genuine garbage.

---

## 5. Optional (not required for v1): a shared format package

Long-term, extract a tiny shared `@opsette/contact-card` module (the Contact field shape + vCard read/write + Digital Card URL decode) that *both* apps import, so the mapping lives in ONE place and future Opsette tools plug in free. **Skip for v1** — duplicating one small mapper is fine; do this only if a third app needs the same contract.

---

## 5b. Testing with ONE phone + one computer (the real-world test rig)

Ruthnie has one phone and is one person, so "one app scans the other" needs a rig. The trick: **the computer's dev server IS the second device.**

Both apps already bind `host: "::"` (all network interfaces), so they're reachable from the phone on the same Wi-Fi with no config change:
- **Digital Card** dev server: port **8104**
- **Contact Capture** dev server: port **8101**

### ⚠️ The gotcha that will silently break it: camera needs a secure context
Phone browsers refuse `getUserMedia()` (the live camera / QR scan) over plain `http://192.168.x.x`. It's only allowed on **`https://` or `localhost`**. So a bare LAN IP will load the page but the camera path will fail quietly. Two ways to handle it:

- **Option 1 (simplest for scanning): don't scan live — scan a still.** Contact Capture's QR path can take an **uploaded image** of a QR (`CardScanner.tsx` upload path), which needs no camera. On the phone, screenshot the QR and use "upload" instead of "live scan." Zero setup.
- **Option 2 (real camera over the network): tunnel with HTTPS.** Run the dev server, then expose it over https with a quick tunnel:
  - `npx localtunnel --port 8101` (or `--port 8104`), or a Cloudflare quick tunnel (`cloudflared tunnel --url http://localhost:8101`). Open the returned `https://…` URL on the phone → camera works.
  - Note base paths: Contact Capture serves at `/` in dev (`base` is `/` unless building), Digital Card serves at `/digital-card/` even in dev (`base: "/digital-card/"` is unconditional) — so on the phone hit `https://<tunnel>/digital-card/` for Digital Card, and `https://<tunnel>/` for Contact Capture.

### The actual test loop
1. On the **computer**, run Digital Card (8104). Fill in a sample card. Generate its **share URL / QR** (`QrModal`).
2. On the **phone**, open Contact Capture (via tunnel for live camera, or use the upload path). Scan/upload that Digital Card QR.
3. ✅ Expect: the contact prefills natively (name/company/title/email/phone mapped), no "not a Contact Capture QR" error, no OCR fallback.
4. **Reverse:** on the computer run Contact Capture, generate MyCard's QR (native vCard). On the phone open Digital Card's shared-view URL to confirm the landing page leads with Save Contact. (Digital Card doesn't scan — it's handed out — so the reverse test is really "does the landing page feel right on a phone.")
5. Seed sample data on either side by just filling the forms; no fixtures needed.

**Tip:** keep both dev servers up at once (different ports, no conflict) so you can bounce between them without restarting.

---

## 6. Build / verify / commit checklist (both apps)

- [ ] Task A: `SharedCardView` leads with Save Contact, mobile-first, Ant. Typecheck clean.
- [ ] Task B: scanner branches vCard vs Digital-Card-URL vs error; new `parseDigitalCardUrl.ts`; fields map; genuine garbage still errors. Typecheck clean.
- [ ] Manual verify: generate a real Digital Card share URL, make a QR of it, scan it in Contact Capture → contact prefills correctly.
- [ ] Manual verify: open a shared Digital Card link on a phone → Save Contact is the obvious first action → one tap adds the contact.
- [ ] Run full build on BOTH apps (only at the end).
- [ ] Commit both (repeated `-m` flags, never here-strings; verify subject with `git log -1 --format=%s`).

---

## 7. Next-level ideas (pick AFTER base ships — nothing cheap)

Ranked by "actual differentiator / truly useful," not gimmick. Ruthnie's read going in: **Contact Capture is the cooler app** (OCR party trick, voice memo, notes, export, emit to parent). Digital Card ultimately just says "here's something pretty, now save my number." The question is whether Digital Card has a real second act.

**Hard constraint (Ruthnie, 2026-07-03):** these are **one-off tools with NO upkeep and NO backend**. Anything that needs a hosted store, an account, or something Ruthnie has to run/maintain is OUT. localStorage-only, or a stateless edge worker at most. This kills several "obvious" NFC-card features on purpose — that's fine, they're not the product these are.

### Digital Card — candidate lifts
- **❌ RULED OUT — Live/updatable hosted card.** Would need a backend + short-ID store to resolve `…/c/ab12` to current data. That's exactly the upkeep these tools avoid. Off the table.
- **❌ RULED OUT — Scan analytics ("who saved me").** Depends on the hosted card above. Off.
- **❌ RULED OUT — Apple/Google Wallet pass.** Wallet is for your *own* passes (boarding, loyalty, ID, payment), not for storing other people's contacts, and a self-showable business-card pass needs Apple/Google developer signing = upkeep. Not worth it for a one-off. Off.
- **✅ KEPT — Multiple cards / contexts.** One "work" card, one "side-business" card, switchable — all in **localStorage**, no backend. Today you can basically only have one and overwrite it; this lets you save several and switch. Fits the tool perfectly and is genuinely useful for someone who wears multiple hats (Mightier + DeeBuilt). **This is the Digital Card lift to do.**

### Contact Capture — candidate lifts
- **✅ KEPT — Smart follow-up nudges.** It already stores `followUp` + `metDate`. Turn that into real reminders ("follow up with 3 people from Tuesday's mixer"). For actual push notifications, a **stateless Cloudflare worker** could fire them (Ruthnie's preference) — no data stored server-side, it just sends. In-app nudges need nothing at all. Makes it a *relationship* tool, not just a capture bucket.
- **✅ KEPT — Event roll-up / recap.** After an event: "here's everyone you met at X, export as a batch, emit to Opsette." It already has `eventId`/`eventName` and emit — this just packages the value. Pure client-side. Smart, moderate lift.
- **✅ KEPT (careful) — Enrich from the card.** After OCR/QR, offer to pull the person's public LinkedIn/site into the note. Contact Capture is the better home for this than Digital Card. Keep it opt-in and obvious to avoid creepiness.

**Infra note:** if anything ever needs a server tick, it's **Cloudflare Workers / Upstash Redis**, NOT Supabase — and only for stateless/ephemeral work (sending a nudge), never for storing the cards or contacts. The data stays on-device.

**None of these are v1.** Log the pick as a follow-up doc when Ruthnie chooses. Front-runners: **Multiple cards** (Digital Card) and **Follow-up nudges / Event recap** (Contact Capture).

---

## Progress log

- **2026-07-03** — Doc written (planning session). Base work = Task A (Digital Card landing leads with Save Contact) + Task B (Contact Capture scanner ingests Digital Card URL). Verified current code: `parseVcard.ts:18` hard-rejects non-vCard; `share.ts:19-23` builds `#/?data=<base64>` URL; `SharedCardView.tsx:54-69` buries Save Contact in a 3-button grid. Not yet built.

- **2026-07-08** — Base work BUILT (both tasks), both apps typecheck + full-build clean, committed & pushed. Testing to happen on live `https://tools.opsette.io` (dev-IP camera can't work — see gotcha note below).
  - **Task A (digital-card):** `SharedCardView.tsx` reworked — Save Contact is now the hero (full-width, 52px, 16px semibold `block` primary) with an honest reassurance line under it (`Adds their {name, number & email} to your phone`, built from `savedFields` so it only names fields the card actually carries). QR + Copy Link demoted to a quiet `type="text"` row under a divider. QR itself unchanged (stays a link). Photo stays off the stranger path — v1 decision (a). Added small `formatList()` helper for the natural A, B & C join.
  - **Task B (contact-capture):** new `src/lib/parseDigitalCardUrl.ts` (mirrors `parseVcard` contract: `Partial<Contact> | null`, matches on `data=` in hash not host, decodes exactly like `share.ts`, returns `null` on any garbage). `CardScanner.handleQrScanned` now branches vCard → Digital Card URL → error via `parseQrPayload()`; forwarding refactored into shared `prefillFromQr()`.
  - **Scope addition (not in original plan):** new `src/lib/decodeQrImage.ts` (jsQR over an uploaded still). `handleFile` now tries QR-decode on ANY uploaded/captured image first, falling back to OCR — so a photo/screenshot of a QR is read as a QR, not run through OCR. This also makes the doc's §5b Option-1 (no-camera) test path real; previously the upload button only did OCR.
- **2026-07-08 (same day, follow-up fixes after live testing):** Ruthnie tested on-device and hit two real bugs the original plan missed. Both fixed; verified working live (Contact Capture ingests fast; phone's native camera pops the vCard "Add to Contacts / call / message / email").
  - **QR now carries a vCard, not a link.** `QrModal.tsx` was encoding `getShareableUrl(card)` (the whole card as a URL) → dense, and it sent plain-camera scanners to a web page. Switched to `generateVCard(card)` so a phone camera reads it natively (instant Add Contact, all fields). Also bumped `errorCorrectionLevel` `'L'` → `'M'` — 'L' was the real reason it scanned so poorly off a screen. Caption "Scan to view card" → "Scan to save contact". Interop still works: Contact Capture ingests the vCard via its existing `parseVcard` path (no CC change needed; `parseDigitalCardUrl` stays as the fallback for pasted share *links*).
  - **Shared-card landing page was off-brand.** Ruthnie noticed the QR-link destination looked "old / broken / wrong style, no footer." Root cause: `SharedCardView` hand-rolled its own header (AppLogo + "Digital Card" text) and a throwaway "Made with Digital Card" line instead of the canonical `OpsetteHeader` + real footer the rest of the app uses. Swapped in `<OpsetteHeader theme={appTheme} rightExtra={<ThemeToggleButton/>} />` and the real How to Use · Privacy · By Opsette footer, wired dark mode via `useTheme`. Now the shared link (Copy Link path) lands on a page matching the family chrome.
  - **Note on the QR being link-based:** that was pre-existing behavior, not something this interop work introduced — the QR always carried the URL. Ruthnie's read ("it was supposed to be a vCard") was correct and is now how it works.

  - **⚠️ Testing gotcha confirmed live:** the in-app **live camera capture cannot run over the dev LAN IP** (`http://192.168.x.x`) — phone browsers gate `getUserMedia()` to `https://`/`localhost`. So native in-app QR scanning must be tested on the deployed `https://tools.opsette.io` domain (or an https tunnel), NOT the dev IP. The upload path works over the dev IP, but Ruthnie wants to test the native camera capture specifically, so testing moved to the live deploy. **Still needs Ruthnie's live verification of both flows.**
