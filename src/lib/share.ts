import { CardData } from '@/types/card';

export function encodeCardToHash(card: CardData): string {
  const json = JSON.stringify(card);
  return btoa(unescape(encodeURIComponent(json)));
}

export function decodeCardFromHash(hash: string): CardData | null {
  try {
    const json = decodeURIComponent(escape(atob(hash)));
    return JSON.parse(json);
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
