import { CardData } from '@/types/card';

/**
 * Downscale a photo data URL to a contact-card-appropriate avatar for embedding
 * in a vCard PHOTO field. A raw full-res upload embeds as multiple MB of base64,
 * which produces a .vcf that iOS/Android contact apps reject or choke on. A
 * ~500px square JPEG is plenty for a contact avatar and lands at tens of KB.
 *
 * Returns a `data:image/jpeg;base64,...` URL, or null if the source can't be
 * decoded (so the vCard is simply emitted without a photo rather than failing).
 */
export async function shrinkPhotoForVCard(
  photo: string,
  maxSize = 500,
  quality = 0.85,
): Promise<string | null> {
  if (!photo || !photo.startsWith('data:image/')) return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const longEdge = Math.max(img.naturalWidth, img.naturalHeight) || maxSize;
        const scale = Math.min(1, maxSize / longEdge);
        const w = Math.max(1, Math.round(img.naturalWidth * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        // White matte so transparent PNGs don't turn black as JPEG.
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = photo;
  });
}

/**
 * Build the vCard 3.0 body. `photoDataUrl` (already sized/encoded) is embedded as
 * the PHOTO field when provided; when omitted, no photo is included. Everything
 * else comes straight from the card fields.
 */
function buildVCard(card: CardData, photoDataUrl?: string | null): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${card.fullName}`,
  ];

  if (card.businessName) lines.push(`ORG:${card.businessName}`);
  if (card.title) lines.push(`TITLE:${card.title}`);
  if (card.phone) lines.push(`TEL;TYPE=WORK,VOICE:${card.phone}`);
  if (card.email) lines.push(`EMAIL;TYPE=INTERNET:${card.email}`);
  if (card.website) lines.push(`URL:${card.website}`);
  if (card.address) lines.push(`ADR;TYPE=WORK:;;${card.address};;;;`);
  if (photoDataUrl) {
    // Extract base64 data + mime from the (sized) data URL. Accept jpeg/png/etc.
    const match = photoDataUrl.match(/^data:image\/([\w+]+);base64,(.+)$/);
    if (match) {
      const type = match[1].split('+')[0].toUpperCase(); // svg+xml → SVG (rare)
      const data = match[2];
      lines.push(`PHOTO;ENCODING=b;TYPE=${type}:${data}`);
    }
  }
  if (card.instagram) {
    const handle = card.instagram.replace('@', '');
    lines.push(`X-SOCIALPROFILE;TYPE=instagram:https://instagram.com/${handle}`);
  }
  if (card.facebook) {
    lines.push(`X-SOCIALPROFILE;TYPE=facebook:${card.facebook}`);
  }
  if (card.linkedin) {
    lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${card.linkedin}`);
  }
  if (card.tiktok) {
    const handle = card.tiktok.replace('@', '');
    lines.push(`X-SOCIALPROFILE;TYPE=tiktok:https://tiktok.com/@${handle}`);
  }
  if (card.twitter) {
    const handle = card.twitter.replace('@', '');
    lines.push(`X-SOCIALPROFILE;TYPE=twitter:https://x.com/${handle}`);
  }
  if (card.youtube) {
    lines.push(`X-SOCIALPROFILE;TYPE=youtube:${card.youtube}`);
  }
  if (card.whatsapp) {
    const num = card.whatsapp.replace(/\D/g, '');
    lines.push(`X-SOCIALPROFILE;TYPE=whatsapp:https://wa.me/${num}`);
  }
  if (card.threads) {
    const handle = card.threads.replace('@', '');
    lines.push(`X-SOCIALPROFILE;TYPE=threads:https://threads.net/@${handle}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/**
 * Synchronous vCard WITHOUT the photo. Used where a photo can't ride along —
 * the contact QR (a QR encodes only ~a few KB; a photo would make it
 * unscannable, and a scanned contact needs the fields, not an avatar).
 */
export function generateVCard(card: CardData): string {
  return buildVCard(card, null);
}

/**
 * Full vCard for a downloadable/bakeable `.vcf`, with the photo downscaled to a
 * contact-safe avatar. Async because the shrink happens on a canvas.
 */
export async function generateVCardFile(card: CardData): Promise<string> {
  const photo = card.photo ? await shrinkPhotoForVCard(card.photo) : null;
  return buildVCard(card, photo);
}

export async function downloadVCard(card: CardData) {
  const vcf = await generateVCardFile(card);
  const blob = new Blob([vcf], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${card.fullName || 'contact'}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * The vCard as a `data:text/vcard;base64,...` URL, for baking into the Brand
 * Kit blob so File Builder can reconstruct the `.vcf` with no manual download.
 * Uses the photo-downscaled `.vcf` so the baked contact file stays small enough
 * for phone contact apps to import. Base64-encodes the UTF-8 VCF so accented
 * names survive.
 */
export async function vCardToDataUrl(card: CardData): Promise<string> {
  const vcf = await generateVCardFile(card);
  const base64 = btoa(unescape(encodeURIComponent(vcf)));
  return `data:text/vcard;base64,${base64}`;
}
