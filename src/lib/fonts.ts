/**
 * Digital Card font resolution — now built on the SHARED font library
 * (`@/lib/shared-fonts`), the same one Palette Studio / Brand Board / Banner
 * Designer read. A card stores ONE pairing `id` (the interop key) and resolves
 * the heading stack for the name and the body stack for secondary text.
 *
 * Why the switch (see docs/DIGITAL-CARD-SHRINK-TO-REAL-PLAN.md §2c): a card
 * exported into a Brand Board must carry the SAME font identity as the rest of
 * the client's kit. That identity travels as the pairing id, so the card can no
 * longer keep its own private 7-font list.
 *
 * `''` (empty id) means "app default" — the first pairing in the library.
 */
import {
  FontPairing,
  cssFamily,
  getPairing,
  loadPairing,
  findPairing,
} from './shared-fonts';

/** The default pairing id when a card hasn't chosen one (empty string). */
export const DEFAULT_FONT_ID = '';

/** Resolve a stored pairing id to its `FontPairing` (falls back to the first). */
export const resolvePairing = (id: string | undefined | null): FontPairing =>
  getPairing(id ?? '');

/** CSS font-family stack for the card's HEADING (the name). */
export const headingStack = (id: string | undefined | null): string =>
  cssFamily(resolvePairing(id).heading);

/** CSS font-family stack for the card's BODY (title, business, labels). */
export const bodyStack = (id: string | undefined | null): string =>
  cssFamily(resolvePairing(id).body);

/** Inject the Google Fonts <link> for a card's pairing. Idempotent, browser-only. */
export const loadCardFont = (id: string | undefined | null): void => {
  loadPairing(resolvePairing(id));
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  LEGACY MIGRATION
 *  Old saved cards stored raw family strings in `nameFont` / `bodyFont` (the
 *  private 7-font list). Map each legacy value onto its nearest shared pairing
 *  id so a reopened card doesn't lose its typography. Unknown / '' → default.
 * ─────────────────────────────────────────────────────────────────────────
 */
const LEGACY_FONT_TO_PAIRING: Record<string, string> = {
  'Inter': 'inter',
  'Space Grotesk': 'space-inter',
  'Playfair Display': 'playfair-montserrat',
  'Fraunces': 'fraunces-nunito',
  'DM Serif Display': 'dmserif-dmsans',
  'Bebas Neue': 'anton-roboto', // no Bebas pair in the library; Anton is the nearest bold display
};

/**
 * Given the two legacy fields, pick the pairing id that best preserves the old
 * card. The name font drove the visible identity, so prefer it; fall back to the
 * body font, then the default. Returns '' when nothing maps.
 */
export function migrateLegacyFonts(
  nameFont: string | undefined,
  bodyFont: string | undefined,
): string {
  for (const legacy of [nameFont, bodyFont]) {
    if (!legacy) continue;
    const id = LEGACY_FONT_TO_PAIRING[legacy];
    if (id && findPairing(id)) return id;
  }
  return DEFAULT_FONT_ID;
}
