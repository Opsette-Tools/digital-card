// Business-card styles ('modern' | 'clean' | 'bold' | 'minimal' | 'neon') were
// cut in the shrink-to-real pass (docs/DIGITAL-CARD-SHRINK-TO-REAL-PLAN.md §1a):
// a screen-only business card is a solved, valueless thing. What remains is the
// contact cards (the real output) + the handout (spun off later, left in place).
// Contact-card templates: the three originals (profile/split/stacked) + two
// new "online identity graphic" layouts added in the shrink pass (§3):
//   • type  — editorial, type-forward with a left accent spine (premium)
//   • photo — large photo/initials hero anchoring, contact as a clean column
// (A "mono" dark card was tried and cut — its name/behavior didn't cohere.)
export type CardStyle =
  | 'profile'
  | 'split'
  | 'stacked'
  | 'type'
  | 'photo'
  | 'handout';

// 'square' is the on-screen contact-card canvas (dimensionless in practice —
// contact templates cap their own width). The two handout print sizes stay for
// the handout, which still has a print use.
export type CardSize = 'square' | 'handout-4x6' | 'handout-5x7';

export type HandoutVariant = 'hero' | 'side' | 'corner';

/** Background treatment for the handout: 'light' = white card, 'dark' = accent gradient. */
export type HandoutTheme = 'light' | 'dark';

export type HandoutLogoSize = 'sm' | 'md' | 'lg';

export interface CardData {
  fullName: string;
  title: string;
  businessName: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  tiktok: string;
  twitter: string;
  youtube: string;
  whatsapp: string;
  threads: string;
  address: string;
  photo: string;
  accentColor: string;
  cardStyle: CardStyle;
  showInitials: boolean;
  cardSize: CardSize;
  showPrintGuides: boolean;

  // Handout-only promo content. Optional so the existing CardData payloads
  // (business + contact cards) keep validating untouched.
  headline: string;
  subheadline: string;
  blurb: string;
  ctaLabel: string;
  ctaUrl: string;
  handoutVariant: HandoutVariant;
  handoutTheme: HandoutTheme;
  handoutLogoSize: HandoutLogoSize;
  /** Optional override for the headline + body text color. Empty = theme default. */
  headlineColor: string;
  /** Optional override for the QR code color. Empty = accent. */
  qrColor: string;
  /** Optional Google Font for the handout headline. Empty = template default.
   *  (Handout-only, legacy 7-font list. The handout is being spun into its own
   *  tool later — left untouched per the shrink plan §1c.) */
  headlineFont: string;
  /** Optional Google Font for the handout sub-headline. */
  subheadlineFont: string;
  /** Optional Google Font for the handout blurb. */
  blurbFont: string;

  /**
   * The contact card's typography, as a SHARED font-library pairing `id`
   * (`@/lib/shared-fonts`). This is the interop key that travels into the Brand
   * Board card blob so the card's fonts match the rest of the client's kit.
   * Empty string = the library's default pairing. Replaces the old private
   * `nameFont` / `bodyFont` string fields (still read once for migration).
   */
  fontId: string;

  /** @deprecated Legacy name-font family string. Read only to migrate → fontId. */
  nameFont?: string;
  /** @deprecated Legacy body-font family string. Read only to migrate → fontId. */
  bodyFont?: string;
}

export const emptyCard: CardData = {
  fullName: '',
  title: '',
  businessName: '',
  phone: '',
  email: '',
  website: '',
  instagram: '',
  facebook: '',
  linkedin: '',
  tiktok: '',
  twitter: '',
  youtube: '',
  whatsapp: '',
  threads: '',
  address: '',
  photo: '',
  accentColor: '#2D3748',
  cardStyle: 'profile',
  showInitials: false,
  cardSize: 'square',
  showPrintGuides: false,
  headline: '',
  subheadline: '',
  blurb: '',
  ctaLabel: '',
  ctaUrl: '',
  handoutVariant: 'hero',
  handoutTheme: 'light',
  handoutLogoSize: 'md',
  headlineColor: '',
  qrColor: '',
  headlineFont: '',
  subheadlineFont: '',
  blurbFont: '',
  fontId: '',
};

export const demoCard: CardData = {
  fullName: 'Jordan Rivera',
  title: 'Owner & Lead Stylist',
  businessName: 'Glow Studio',
  phone: '+1 (555) 234-5678',
  email: 'jordan@glowstudio.com',
  website: 'https://glowstudio.com',
  instagram: '@glowstudio',
  facebook: 'https://facebook.com/glowstudio',
  linkedin: 'https://linkedin.com/in/jordanrivera',
  tiktok: '@glowstudio',
  twitter: '',
  youtube: '',
  whatsapp: '',
  threads: '',
  address: '742 Elm Street, Suite 3, Portland, OR 97205',
  photo: '',
  accentColor: '#4A6741',
  cardStyle: 'profile',
  showInitials: false,
  cardSize: 'square',
  showPrintGuides: false,
  headline: '',
  subheadline: '',
  blurb: '',
  ctaLabel: '',
  ctaUrl: '',
  handoutVariant: 'hero',
  handoutTheme: 'light',
  handoutLogoSize: 'md',
  headlineColor: '',
  qrColor: '',
  headlineFont: '',
  subheadlineFont: '',
  blurbFont: '',
  fontId: '',
};

export const demoHandout: Partial<CardData> = {
  cardStyle: 'handout',
  cardSize: 'handout-4x6',
  handoutVariant: 'hero',
  handoutTheme: 'light',
  headline: 'Find your style',
  subheadline: 'New client offer',
  blurb: '<p>20% off your first cut. Scan to book.</p>',
  ctaLabel: 'Book online',
  ctaUrl: 'https://opsette.io',
  fullName: 'Glow Studio',
  businessName: '',
  accentColor: '#4A6741',
};

export const CONTACT_STYLES: CardStyle[] = ['profile', 'split', 'stacked', 'type', 'photo'];
export const HANDOUT_STYLES: CardStyle[] = ['handout'];

export const isContactStyle = (s: CardStyle) => CONTACT_STYLES.includes(s);
export const isHandoutStyle = (s: CardStyle) => HANDOUT_STYLES.includes(s);
