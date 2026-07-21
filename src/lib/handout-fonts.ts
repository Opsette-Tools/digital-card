/**
 * HANDOUT-ONLY font list (the legacy private 7-font set). The handout is being
 * spun into its own tool later and is left untouched in the shrink-to-real pass
 * (docs/DIGITAL-CARD-SHRINK-TO-REAL-PLAN.md §1c), so its three font selects keep
 * this old model rather than moving to the shared pairing library that the
 * CONTACT cards now use (`@/lib/fonts` → `@/lib/shared-fonts`).
 *
 * Empty string === use the template's default. All families load via the
 * <link> tag in index.html so switching is instant and html-to-image captures
 * rendered glyphs (await document.fonts.ready before export).
 */
export interface FontOption {
  /** UI label */
  label: string;
  /** Stored value — also a valid font-family string */
  value: string;
  /** Full CSS stack with sensible fallback */
  stack: string;
  /** UI category for grouping */
  category: 'sans' | 'serif' | 'display';
}

export const FONT_OPTIONS: FontOption[] = [
  { label: 'Default',         value: '',                 stack: '',                                                       category: 'sans' },
  { label: 'Inter',           value: 'Inter',            stack: 'Inter, system-ui, sans-serif',                           category: 'sans' },
  { label: 'Space Grotesk',   value: 'Space Grotesk',    stack: '"Space Grotesk", Inter, system-ui, sans-serif',         category: 'sans' },
  { label: 'Playfair Display',value: 'Playfair Display', stack: '"Playfair Display", Georgia, serif',                    category: 'serif' },
  { label: 'Fraunces',        value: 'Fraunces',         stack: 'Fraunces, Georgia, serif',                              category: 'serif' },
  { label: 'DM Serif Display',value: 'DM Serif Display', stack: '"DM Serif Display", Georgia, serif',                    category: 'display' },
  { label: 'Bebas Neue',      value: 'Bebas Neue',       stack: '"Bebas Neue", Impact, sans-serif',                      category: 'display' },
];

const STACK_BY_VALUE = new Map(FONT_OPTIONS.map(f => [f.value, f.stack]));

/** Resolve a stored value to a CSS font-family stack. Empty/unknown → undefined. */
export const resolveFontStack = (value: string | undefined | null): string | undefined => {
  if (!value) return undefined;
  return STACK_BY_VALUE.get(value);
};
