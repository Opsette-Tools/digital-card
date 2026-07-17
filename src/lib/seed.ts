// Digital Card's adapter for the shared brand-core seed (Mechanism 1 of
// docs/KIT-SUITE-CONNECT-PLAN.md). Maps a generic BrandCore — the four facts
// that ride in a ?seed= URL — onto CardData, so a card opens with the client's
// business name and brand accent already filled instead of blank. Additive: no
// seed = today's behavior. Kept out of the vendored (tool-agnostic) module.
import type { BrandCore } from './opsette-kit-link';
import { CardData, emptyCard } from '@/types/card';

// Normalize a seed hex to the "#RRGGBB" the card accent expects.
function normalizeHex(hex: string): string | null {
  let h = hex.trim();
  if (!h) return null;
  if (!h.startsWith('#')) h = `#${h}`;
  if (/^#[0-9a-fA-F]{3}$/.test(h)) {
    h = `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  }
  return /^#[0-9a-fA-F]{6}$/.test(h) ? h.toUpperCase() : null;
}

function pickAccent(core: BrandCore): string | null {
  const colors = core.colors ?? [];
  const primary =
    colors.find((c) => c.role === 'primary' || c.role === 'base') ?? colors[0];
  return primary ? normalizeHex(primary.hex) : null;
}

/**
 * Map a decoded brand core onto a partial CardData. The brand name seeds the
 * business name, the tagline seeds the title line, the primary color seeds the
 * card accent. A small inlined logo seeds `photo` (Digital Card has no distinct
 * logo field — `photo` drives the visual). Returns null when nothing maps.
 */
export function seedToCard(core: BrandCore): Partial<CardData> | null {
  const patch: Partial<CardData> = {};
  if (core.name) patch.businessName = core.name;
  if (core.tagline) patch.title = core.tagline;
  const accent = pickAccent(core);
  if (accent) patch.accentColor = accent;
  if (core.logo && core.logo.startsWith('data:')) patch.photo = core.logo;
  return Object.keys(patch).length > 0 ? patch : null;
}

/** Build the initial CardData for the page: emptyCard patched by any seed. */
export function initialCardFromSeed(core: BrandCore | null): CardData {
  const patch = core ? seedToCard(core) : null;
  return patch ? { ...emptyCard, ...patch } : { ...emptyCard };
}
