// Opsette Share — per-app configuration.
// Each Opsette tool fills this in; the rest of the bundle is identical across apps.

export type OpsetteShareConfig = {
  appName: string;
  tagline: string;
  url: string;
  logoSrc?: string;
};

export const opsetteShareConfig: OpsetteShareConfig = {
  appName: "CardCraft",
  tagline: "Create and share your digital business card.",
  url: "https://tools.opsette.io/digital-card/",
  logoSrc: "opsette-logo.png",
};
