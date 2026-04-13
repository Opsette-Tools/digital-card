import { CardData } from '@/types/card';

export function generateVCard(card: CardData): string {
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

export function downloadVCard(card: CardData) {
  const vcf = generateVCard(card);
  const blob = new Blob([vcf], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${card.fullName || 'contact'}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}
