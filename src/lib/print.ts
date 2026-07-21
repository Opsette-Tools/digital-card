import type { CardSize } from '@/types/card';

export const DPI = 300;
export const BLEED_IN = 0.125;
export const SAFE_IN = 0.125;

interface SizeBase {
  label: string;
  trimWIn: number;
  trimHIn: number;
  showGuides: boolean;
}

// Business-card sizes (us-business / eu-business) were cut with the business
// templates in the shrink-to-real pass (§1a) — a screen-only business card has
// no print value worth chasing. What's left: the on-screen contact canvas
// ('square', dimensionless in practice) and the two handout print sizes (the
// handout still has a real print use). Bleed/safe guides were a business-print
// feature and are dropped — showGuides is false everywhere now.
const SIZES: Record<CardSize, SizeBase> = {
  'square':      { label: 'Square (2.5×2.5 in)', trimWIn: 2.5, trimHIn: 2.5, showGuides: false },
  'handout-4x6': { label: 'Handout (4×6 in)',    trimWIn: 4,   trimHIn: 6,   showGuides: false },
  'handout-5x7': { label: 'Handout (5×7 in)',    trimWIn: 5,   trimHIn: 7,   showGuides: false },
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
  const base = SIZES[size] ?? SIZES['square'];
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

export const HANDOUT_SIZE_OPTIONS: { value: CardSize; label: string }[] = [
  { value: 'handout-4x6', label: '4×6' },
  { value: 'handout-5x7', label: '5×7' },
];
