// Brand Kit interop for Digital Card — the `type:"card"` payload.
//
// Same "triple duty" pattern as Palette Studio / Signature Studio / QR Creator /
// Icon Kit (see docs/BRAND-KIT-INTEROP-CONTRACT.md, section 3): ONE blob does
// both jobs.
//   • Brand Board reads the BAKED assets — `data.image` (the rendered card PNG)
//     and `data.vcard` (the .vcf) — so the whole kit flows Digital Card → Brand
//     Board → File Builder with NO manual download. (Before this, the card PNG
//     was the one asset with no interop: it had to be downloaded by hand and
//     re-uploaded into Brand Board.)
//   • Reopen reads `data.card` (+ `data.cardStyle`) — the full CardData recipe —
//     to rebuild the exact card in this app for a revision.
//
// Why bake BOTH an image and a vcard: the PNG is the VISUAL half (what the card
// looks like); the .vcf is the FUNCTIONAL half (the client saves it to their own
// phone contacts and shares it with customers). The kit should deliver both, so
// both ride inside the one blob as base64 data URLs — mirroring how Icon Kit
// bakes its social PNGs and Palette Studio bakes its PNG + PDF. File Builder's
// `dataUrlToFile` reads the MIME, so `text/vcard` wraps as cleanly as an image.

import { CardData, emptyCard, CardStyle } from '@/types/card';
import { vCardToDataUrl } from './vcard';

export interface CardPayload {
  type: 'card';
  v: 1;
  source: 'opsette';
  data: {
    /** One of the 9 card templates — carried for reopen / future re-render. */
    cardStyle: CardStyle;
    /** The full card recipe — reopen rebuilds the exact card from this. */
    card: CardData;
    // ── Baked assets (the reason this app finally has interop) ──────────────
    /** The rendered card as a PNG data URL. Optional: a caller that couldn't
     *  capture the node still emits a valid, reopen-able payload. */
    image?: string; // data:image/png;base64,...
    /** The vCard as a text/vcard data URL — the functional "add to contacts"
     *  half of the deliverable. Always present when a name exists. */
    vcard?: string; // data:text/vcard;base64,...
  };
}

/**
 * Serialize the current card into the shared Brand Kit shape.
 *
 * `image` is passed in by the caller (it already has the capture from the export
 * flow / the on-screen node) so this module stays free of DOM concerns. The
 * `.vcf` is derived here from the card fields. Both bakes are optional at the
 * type level so a partial export (e.g. capture failed) is still a valid,
 * reopen-able blob rather than a hard failure.
 */
export async function toKitJson(card: CardData, image?: string): Promise<CardPayload> {
  return {
    type: 'card',
    v: 1,
    source: 'opsette',
    data: {
      cardStyle: card.cardStyle,
      card,
      ...(image ? { image } : {}),
      vcard: await vCardToDataUrl(card),
    },
  };
}

/**
 * Parse a pasted blob back into a card payload — used by the reopen path.
 * Strict on the envelope (type/v/source) so a random paste is rejected; never
 * throws, returns null for anything that isn't a valid Opsette card blob. The
 * interior is read leniently: reopen only needs `data.card`, merged onto
 * `emptyCard` so a blob from an older/leaner shape still restores cleanly.
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
  // Merge onto emptyCard so any field the blob omits falls back to a valid
  // default — the reopened card is always a complete CardData.
  return { ...emptyCard, ...(d.card as Partial<CardData>) };
}
