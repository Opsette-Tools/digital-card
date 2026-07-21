// Brand Kit interop for Digital Card — the `type:"card"` payload.
//
// Same "triple duty" pattern as Palette Studio / Signature Studio / QR Creator /
// Icon Kit (see docs/BRAND-KIT-INTEROP-CONTRACT.md, section 3): ONE blob does
// both jobs.
//   • Brand Board reads the BAKED assets — `data.image` (the rendered card PNG),
//     `data.vcard` (the .vcf), and `data.qr` (the vCard QR PNG) — so the whole
//     kit flows Digital Card → Brand Board → File Builder with NO manual
//     download.
//   • Reopen reads `data.card` (+ `data.cardStyle`) — the full CardData recipe —
//     to rebuild the exact card in this app for a revision.
//
// Why bake image + vcard + qr:
//   • the PNG is the VISUAL half (what the card looks like);
//   • the .vcf is the FUNCTIONAL half (the client saves it to their own phone
//     contacts and shares it with customers);
//   • the QR is the ONE tap-to-save asset that isn't a dead end — scan → the
//     phone offers to save the contact. Before the shrink pass the QR never
//     reached the kit (docs/DIGITAL-CARD-SHRINK-TO-REAL-PLAN.md §2a); baking it
//     is the highest-value fix in the rethink.
// All three ride inside the one blob as base64 data URLs. File Builder's
// `dataUrlToFile` reads the MIME, so `text/vcard` and `image/png` wrap cleanly.
//
// The card's font identity travels too, as the shared-library pairing `id`
// (§2c) — the SAME interop key Palette Studio / Brand Board carry — so a card
// dropped into a brand board shares the kit's font identity instead of keeping
// a private font list.

import QRCode from 'qrcode';
import { CardData, CardStyle } from '@/types/card';
import { vCardToDataUrl, generateVCard } from './vcard';
import { resolvePairing } from './fonts';
import { googleHref } from './shared-fonts';
import { normalizeCard } from './card-normalize';

export interface CardPayload {
  type: 'card';
  v: 1;
  source: 'opsette';
  data: {
    /** One of the card templates — carried for reopen / future re-render. */
    cardStyle: CardStyle;
    /** The full card recipe — reopen rebuilds the exact card from this. */
    card: CardData;
    /**
     * The card's font identity, as a shared-library pairing. Mirrors the
     * palette blob's `font` object (id + resolved families + googleHref) so
     * every kit tool resolves the SAME fonts. `id` is the interop key.
     */
    font: {
      id: string;
      heading: string;
      body: string;
      googleHref: string;
    };
    // ── Baked assets (the reason this app finally has interop) ──────────────
    /** The rendered card as a PNG data URL. Optional: a caller that couldn't
     *  capture the node still emits a valid, reopen-able payload. */
    image?: string; // data:image/png;base64,...
    /** The vCard as a text/vcard data URL — the functional "add to contacts"
     *  half of the deliverable. Always present when a name exists. */
    vcard?: string; // data:text/vcard;base64,...
    /** A vCard QR as a PNG data URL — the tap-to-save half. Encodes the contact
     *  FIELDS (not a link), so it works forever, offline, with no hosting
     *  dependency. Photo-less (a vCard-with-photo is too dense to scan). */
    qr?: string; // data:image/png;base64,...
  };
}

/**
 * Render a photo-less vCard QR as a PNG data URL. Same encoding as QrModal (the
 * on-screen QR) so the baked kit asset matches what the user previews: a vCard
 * QR at error-correction 'M', accent-colored. Returns undefined on any failure
 * so a QR hiccup never blocks the rest of the (still valid) blob.
 */
async function renderVCardQr(card: CardData): Promise<string | undefined> {
  if (!card.fullName) return undefined;
  try {
    const accent = card.accentColor || '#2D3748';
    const hex = accent.replace('#', '').padEnd(6, '0').slice(0, 6);
    return await QRCode.toDataURL(generateVCard(card), {
      width: 1024,
      margin: 2,
      color: { dark: `#${hex}`, light: '#ffffff' },
      errorCorrectionLevel: 'M',
    });
  } catch {
    return undefined;
  }
}

/**
 * Serialize the current card into the shared Brand Kit shape.
 *
 * `image` is passed in by the caller (it already has the capture from the export
 * flow / the on-screen node) so this module stays free of DOM concerns. The
 * `.vcf` and the QR are derived here from the card fields. All bakes are optional
 * at the type level so a partial export (e.g. capture failed) is still a valid,
 * reopen-able blob rather than a hard failure.
 */
export async function toKitJson(card: CardData, image?: string): Promise<CardPayload> {
  const pairing = resolvePairing(card.fontId);
  const [vcard, qr] = await Promise.all([
    vCardToDataUrl(card),
    renderVCardQr(card),
  ]);
  return {
    type: 'card',
    v: 1,
    source: 'opsette',
    data: {
      cardStyle: card.cardStyle,
      card,
      font: {
        id: pairing.id,
        heading: pairing.heading.family,
        body: pairing.body.family,
        googleHref: googleHref(pairing),
      },
      ...(image ? { image } : {}),
      vcard,
      ...(qr ? { qr } : {}),
    },
  };
}

/**
 * Parse a pasted blob back into a card payload — used by the reopen path.
 * Strict on the envelope (type/v/source) so a random paste is rejected; never
 * throws, returns null for anything that isn't a valid Opsette card blob. The
 * interior is read leniently: reopen only needs `data.card`, normalized so a
 * blob from an older/leaner shape still restores cleanly.
 */
export function fromKitJson(raw: string): CardData | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.trim());
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null) return null;
  const p = parsed as Record<string, unknown>;
  if (p.type !== 'card' || p.v !== 1 || p.source !== 'opsette') return null;
  const data = p.data;
  if (typeof data !== 'object' || data === null) return null;
  const d = data as Record<string, unknown>;
  if (typeof d.card !== 'object' || d.card === null) return null;
  return normalizeCard(d.card as Partial<CardData>);
}
