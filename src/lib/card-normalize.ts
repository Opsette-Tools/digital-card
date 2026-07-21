// Normalize a raw CardData (from a paste, a share link, or localStorage) onto a
// complete, current-shape card. Kept in its own light module (no qrcode / DOM
// deps) so both the Brand Board reopen path (brandKit.ts) and the share-link
// decode (share.ts) can call it.
import { CardData, CardStyle, emptyCard } from '@/types/card';
import { migrateLegacyFonts } from './fonts';

const VALID_STYLES: CardStyle[] = ['profile', 'split', 'stacked', 'type', 'photo', 'handout'];

/**
 * Merge a partial card onto `emptyCard`, then bring it to the current shape:
 *   • migrate the legacy `nameFont`/`bodyFont` strings → the shared pairing
 *     `fontId` when the blob predates the shared-font switch (§2c);
 *   • coerce a dropped business-card style (cut in the shrink pass, §1a) onto a
 *     contact style so an old blob still renders.
 * The result is always a complete, valid CardData.
 */
export function normalizeCard(partial: Partial<CardData>): CardData {
  const merged: CardData = { ...emptyCard, ...partial };
  if (!merged.fontId && (partial.nameFont || partial.bodyFont)) {
    merged.fontId = migrateLegacyFonts(partial.nameFont, partial.bodyFont);
  }
  if (!VALID_STYLES.includes(merged.cardStyle)) merged.cardStyle = 'profile';
  delete merged.nameFont;
  delete merged.bodyFont;
  return merged;
}
