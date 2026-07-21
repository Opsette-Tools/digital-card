import { CardData } from '@/types/card';
import { normalizeCard } from './card-normalize';

export function encodeCardToHash(card: CardData): string {
  // Exclude photo — base64 data URLs are too large for QR codes and URLs
  const { photo, ...shareable } = card;
  const json = JSON.stringify(shareable);
  return btoa(unescape(encodeURIComponent(json)));
}

export function decodeCardFromHash(hash: string): CardData | null {
  try {
    const json = decodeURIComponent(escape(atob(hash)));
    // Normalize so a legacy shared card (a cut business style, or old font
    // fields) still resolves to a valid contact card instead of a blank render.
    return normalizeCard(JSON.parse(json));
  } catch {
    return null;
  }
}

export function getShareableUrl(card: CardData): string {
  const encoded = encodeCardToHash(card);
  const base = window.location.href.split('#')[0];
  return `${base}#/?data=${encoded}`;
}

export function getCardFromUrl(): CardData | null {
  const hash = window.location.hash;
  const match = hash.match(/[?&]data=([^&]+)/);
  if (!match) return null;
  return decodeCardFromHash(match[1]);
}
