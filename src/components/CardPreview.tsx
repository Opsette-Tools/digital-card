import React from 'react';
import { CardData } from '@/types/card';
import { Phone, Mail, Globe, Instagram, Facebook, MapPin } from 'lucide-react';

interface CardPreviewProps {
  card: CardData;
  cardRef?: React.RefObject<HTMLDivElement>;
}

type ContactEntry = { icon: React.ElementType; label: string; href?: string };

const getInitials = (value: string) => {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'YN';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

const hexToRgb = (hex: string) => {
  const h = hex.replace('#', '').padEnd(6, '0').slice(0, 6);
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
};
const withAlpha = (hex: string, a: number) => { const { r, g, b } = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; };
const blend = (hex: string, t: number, a: number) => { const { r, g, b } = hexToRgb(hex); const m = (c: number) => Math.round(c + (t - c) * a); return `rgb(${m(r)},${m(g)},${m(b)})`; };
const darken = (hex: string, a: number) => blend(hex, 0, a);
const trimUrl = (v: string) => v.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

const buildContacts = (card: CardData): ContactEntry[] =>
  [
    card.phone ? { icon: Phone, label: card.phone, href: `tel:${card.phone}` } : null,
    card.email ? { icon: Mail, label: card.email, href: `mailto:${card.email}` } : null,
    card.website ? { icon: Globe, label: trimUrl(card.website), href: card.website } : null,
    card.instagram ? { icon: Instagram, label: card.instagram, href: `https://instagram.com/${card.instagram.replace('@', '')}` } : null,
    card.facebook ? { icon: Facebook, label: trimUrl(card.facebook), href: card.facebook } : null,
    card.address ? { icon: MapPin, label: card.address } : null,
  ].filter(Boolean) as ContactEntry[];

/** Flat single-line contact row */
const ContactRow = ({ entry, light = false, accentColor }: { entry: ContactEntry; light?: boolean; accentColor: string }) => {
  const Icon = entry.icon;
  const inner = (
    <span className="flex items-center gap-1.5 min-w-0">
      <Icon size={11} className="shrink-0" style={{ color: light ? 'rgba(255,255,255,0.7)' : darken(accentColor, 0.1), opacity: 0.85 }} />
      <span className="truncate text-[10px] leading-none" style={{ color: light ? 'rgba(255,255,255,0.85)' : undefined }}>{entry.label}</span>
    </span>
  );
  if (entry.href) return <a href={entry.href} target="_blank" rel="noopener noreferrer" className="block py-[3px] hover:opacity-80 transition-opacity">{inner}</a>;
  return <div className="py-[3px]">{inner}</div>;
};

const CardPreview: React.FC<CardPreviewProps> = ({ card, cardRef }) => {
  const { fullName, title, businessName, photo, accentColor, cardStyle } = card;
  const accent = accentColor || '#1a1a2e';
  const displayName = businessName || fullName || 'Your Name';
  const secondaryName = businessName && fullName && businessName !== displayName ? fullName : undefined;
  const initials = getInitials(fullName || businessName || 'Your Name');
  const contacts = buildContacts(card);
  const hasContact = contacts.length > 0;

  // ── Monogram Panel: left accent strip with initials, right side has name + flat contacts ──
  if (cardStyle === 'modern') {
    return (
      <div ref={cardRef} className="w-full overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-500" style={{ maxWidth: 400, aspectRatio: '1.75 / 1', boxShadow: `0 16px 40px -16px ${withAlpha(accent, 0.25)}` }}>
        <div className="grid h-full" style={{ gridTemplateColumns: '94px 1fr' }}>
          {/* Left accent panel */}
          <div className="relative flex flex-col items-center justify-between overflow-hidden py-4 px-2" style={{ background: `linear-gradient(170deg, ${accent}, ${darken(accent, 0.25)})` }}>
            <div className="absolute -right-4 top-2 h-16 w-16 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <div className="relative z-10 flex h-[60px] w-[60px] items-center justify-center rounded-xl text-[22px] font-semibold tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.92)', border: '2px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.08)' }}>
              {initials}
            </div>
            {photo && (
              <img src={photo} alt={fullName || displayName} className="h-9 w-9 rounded-full object-cover" style={{ border: '2px solid rgba(255,255,255,0.2)' }} />
            )}
            {!photo && <div className="h-px w-10" style={{ background: 'rgba(255,255,255,0.25)' }} />}
          </div>

          {/* Right content */}
          <div className="relative flex flex-col justify-between py-3.5 px-4">
            <div className="absolute inset-y-3 left-0 w-px" style={{ background: `linear-gradient(to bottom, ${withAlpha(accent, 0)}, ${withAlpha(accent, 0.2)}, ${withAlpha(accent, 0)})` }} />
            <div className="min-w-0">
              <h2 className="truncate text-[17px] font-semibold leading-tight tracking-tight text-card-foreground">{displayName}</h2>
              {title && <p className="mt-0.5 text-[10px] text-muted-foreground">{title}</p>}
              {secondaryName && <p className="mt-0.5 text-[9px] text-muted-foreground/70">{secondaryName}</p>}
            </div>
            {hasContact && (
              <div className="mt-2 grid grid-cols-2 gap-x-3">
                {contacts.slice(0, 6).map(e => <ContactRow key={e.label} entry={e} accentColor={accent} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Wordmark Badge: initials badge inline with name, corner brackets, flat contacts ──
  if (cardStyle === 'clean') {
    return (
      <div ref={cardRef} className="relative w-full overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-500" style={{ maxWidth: 400, aspectRatio: '1.75 / 1', boxShadow: '0 16px 40px -18px rgba(0,0,0,0.12)' }}>
        {/* Corner brackets */}
        <div className="absolute left-3.5 top-3.5 h-4 w-4 rounded-tl-md border-l-[2px] border-t-[2px]" style={{ borderColor: withAlpha(accent, 0.4) }} />
        <div className="absolute bottom-3.5 right-3.5 h-4 w-4 rounded-br-md border-b-[2px] border-r-[2px]" style={{ borderColor: withAlpha(accent, 0.4) }} />

        <div className="relative z-10 flex h-full flex-col justify-between p-4 pt-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-[18px] font-semibold leading-none tracking-tight text-card-foreground">{displayName}</h2>
                <span className="inline-flex h-6 items-center rounded-md px-2 text-[9px] font-bold tracking-[0.2em]" style={{ background: withAlpha(accent, 0.1), color: darken(accent, 0.15) }}>
                  {initials}
                </span>
              </div>
              {title && <p className="mt-1 text-[10px] text-muted-foreground">{title}</p>}
              {secondaryName && <p className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground/70">{secondaryName}</p>}
            </div>
            {photo && <img src={photo} alt={fullName || displayName} className="h-11 w-11 shrink-0 rounded-xl object-cover" style={{ border: `1.5px solid ${withAlpha(accent, 0.18)}` }} />}
          </div>

          {/* Divider */}
          <div className="my-2 h-px" style={{ background: `linear-gradient(90deg, ${accent}, ${withAlpha(accent, 0.08)})` }} />

          {/* Bottom: address left, contacts right */}
          <div className="grid grid-cols-[1fr_1.1fr] gap-3">
            <div className="flex flex-col justify-between min-w-0">
              {card.address && <p className="text-[9px] leading-[1.4] text-muted-foreground">{card.address}</p>}
              {!card.address && secondaryName && <p className="text-[10px] text-card-foreground">{secondaryName}</p>}
              <div className="h-px w-10 mt-1" style={{ background: withAlpha(accent, 0.18) }} />
            </div>
            {hasContact && (
              <div>
                {contacts.filter(e => e.icon !== MapPin).slice(0, 5).map(e => <ContactRow key={e.label} entry={e} accentColor={accent} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Signature Band: full-bleed accent, giant watermark initials, frosted contact band ──
  return (
    <div ref={cardRef} className="w-full overflow-hidden rounded-2xl transition-all duration-500" style={{ maxWidth: 400, aspectRatio: '1.75 / 1', boxShadow: `0 20px 48px -20px ${withAlpha(accent, 0.4)}` }}>
      <div className="relative h-full overflow-hidden" style={{ background: `linear-gradient(150deg, ${darken(accent, 0.4)}, ${accent})` }}>
        {/* Giant watermark initials */}
        <div className="absolute -right-2 -top-1 text-[80px] font-bold leading-none tracking-[0.08em] select-none" style={{ color: 'rgba(255,255,255,0.05)' }}>
          {initials}
        </div>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent 40%)' }} />

        <div className="relative z-10 flex h-full flex-col justify-between p-4">
          {/* Top: name + photo */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 pt-0.5">
              <h2 className="truncate text-[20px] font-semibold leading-none tracking-tight" style={{ color: 'rgba(255,255,255,0.95)' }}>{displayName}</h2>
              {title && <p className="mt-1 text-[10px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{title}</p>}
              {secondaryName && <p className="mt-0.5 text-[9px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{secondaryName}</p>}
            </div>
            {photo ? (
              <img src={photo} alt={fullName || displayName} className="h-12 w-12 shrink-0 rounded-xl object-cover" style={{ border: '2px solid rgba(255,255,255,0.18)' }} />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[16px] font-semibold tracking-[0.12em]" style={{ border: '2px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)' }}>
                {initials}
              </div>
            )}
          </div>

          {/* Contact band */}
          {hasContact && (
            <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="grid grid-cols-2 gap-x-3">
                {contacts.slice(0, 6).map(e => <ContactRow key={e.label} entry={e} accentColor={accent} light />)}
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full" style={{ background: `linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.35), rgba(255,255,255,0.15))` }} />
      </div>
    </div>
  );
};

export default CardPreview;
