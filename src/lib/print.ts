import type { CardSize } from '@/types/card';

export const DPI = 300;
export const BLEED_IN = 0.125;
export const SAFE_IN = 0.125;

interface SizeBase {
  label: string;
  trimWIn: number;
  trimHIn: number;
  /** Whether bleed/safe-area guides are meaningful for this size. */
  showGuides: boolean;
}

const SIZES: Record<CardSize, SizeBase> = {
  'us-business': { label: 'US Business (3.5×2 in)', trimWIn: 3.5, trimHIn: 2, showGuides: true },
  'eu-business': { label: 'EU Business (85×55 mm)', trimWIn: 3.346, trimHIn: 2.165, showGuides: true },
  'square':      { label: 'Square (2.5×2.5 in)', trimWIn: 2.5, trimHIn: 2.5, showGuides: false },
};

export interface Dimensions {
  size: CardSize;
  trimWIn: number;
  trimHIn: number;
  bleedWIn: number;
  bleedHIn: number;
  safeWIn: number;
  safeHIn: number;
  trimWPx: number;
  trimHPx: number;
  aspectRatio: string;
  label: string;
  showGuides: boolean;
}

export const getDimensions = (size: CardSize): Dimensions => {
  const base = SIZES[size] ?? SIZES['us-business'];
  const trimWIn = base.trimWIn;
  const trimHIn = base.trimHIn;
  return {
    size,
    trimWIn,
    trimHIn,
    bleedWIn: trimWIn + 2 * BLEED_IN,
    bleedHIn: trimHIn + 2 * BLEED_IN,
    safeWIn: trimWIn - 2 * SAFE_IN,
    safeHIn: trimHIn - 2 * SAFE_IN,
    trimWPx: Math.round(trimWIn * DPI),
    trimHPx: Math.round(trimHIn * DPI),
    aspectRatio: `${trimWIn} / ${trimHIn}`,
    label: base.label,
    showGuides: base.showGuides,
  };
};

// Square is intentionally hidden from the picker for now — kept in the
// CardSize union so existing localStorage payloads still validate. When a
// future card-craft tier (postcards / handouts) lands, square will move to
// that tier's options.
export const SIZE_OPTIONS: { value: CardSize; label: string }[] = [
  { value: 'us-business', label: 'US (3.5×2)' },
  { value: 'eu-business', label: 'EU (85×55)' },
];
