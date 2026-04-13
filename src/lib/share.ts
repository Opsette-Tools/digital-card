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
  return `${window.location.origin}${window.location.pathname}#data=${encoded}`;
}

export function getCardFromUrl(): CardData | null {
  const hash = window.location.hash;
  if (!hash.startsWith('#data=')) return null;
  const encoded = hash.slice(6);
  return decodeCardFromHash(encoded);
}
