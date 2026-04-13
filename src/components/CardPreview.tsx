import React from 'react';
import { CardData } from '@/types/card';

interface CardPreviewProps {
  card: CardData;
  cardRef?: React.RefObject<HTMLDivElement>;
}

type ContactEntry = { icon: React.FC<{ size?: number; style?: React.CSSProperties }>; label: string; href?: string };

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
const lighten = (hex: string, a: number) => blend(hex, 255, a);
const trimUrl = (v: string) => v.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

// Minimal SVG icons — thin strokes, no fill, professional look
const s = 'currentColor';
const I = {
  phone: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><path d="M6.5 2.5h3M8 12.5v.5M5 1h6a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V2a1 1 0 011-1z" stroke={s} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  mail: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><rect x="1" y="3" width="14" height="10" rx="1.5" stroke={s} strokeWidth="1.2"/><path d="M1 4.5l7 4.5 7-4.5" stroke={s} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  globe: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><circle cx="8" cy="8" r="6.5" stroke={s} strokeWidth="1.2"/><path d="M1.5 8h13M8 1.5c-2 2.5-2 9.5 0 13M8 1.5c2 2.5 2 9.5 0 13" stroke={s} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  instagram: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><rect x="2" y="2" width="12" height="12" rx="3.5" stroke={s} strokeWidth="1.2"/><circle cx="8" cy="8" r="3" stroke={s} strokeWidth="1.2"/><circle cx="11.5" cy="4.5" r="0.75" fill={s}/></svg>,
  facebook: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><path d="M9.5 2.5H11V0H9.5a3 3 0 00-3 3v1.5H5V7h1.5v9h3V7h2L12 4.5H9.5V3.5a1 1 0 011-1z" stroke={s} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,0) scale(1)"/></svg>,
  linkedin: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><rect x="2" y="2" width="12" height="12" rx="2" stroke={s} strokeWidth="1.2"/><path d="M5.5 7v3.5M8 10.5V8.5a1.5 1.5 0 013 0v2M5.5 5.5v0" stroke={s} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  tiktok: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><path d="M10 2v8a3.5 3.5 0 11-2.5-3.35M10 2h2a3 3 0 003 3" stroke={s} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  twitter: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><path d="M12.5 2L8.2 7.4M3.5 14l4.3-5.4M3.5 2l5.7 7.4L12.5 14" stroke={s} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  youtube: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><rect x="1.5" y="3" width="13" height="10" rx="3" stroke={s} strokeWidth="1.2"/><path d="M6.5 6l3.5 2-3.5 2z" fill={s}/></svg>,
  whatsapp: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><path d="M8 1.5a6.5 6.5 0 00-5.6 9.8L1.5 14.5l3.3-.9A6.5 6.5 0 108 1.5z" stroke={s} strokeWidth="1.2"/><path d="M6 6.5a1 1 0 011-1h.5l1.5 2-1 1 1.5 1.5 1-1 2 1.5v.5a1 1 0 01-1 1c-2 0-5.5-3-5.5-5.5z" stroke={s} strokeWidth="0.8"/></svg>,
  threads: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><path d="M10.5 4C9 2.5 6.5 3 6 5s.5 3 2.5 3 3-.5 3-2.5S10 3 8 3s-4 2-4 5 2.5 5 4.5 5 3-1 3.5-2.5" stroke={s} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  pin: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.5-2-4.5-4.5-4.5z" stroke={s} strokeWidth="1.2"/><circle cx="8" cy="6" r="1.5" stroke={s} strokeWidth="1.2"/></svg>,
};

const buildContacts = (card: CardData): ContactEntry[] =>
  [
    card.phone ? { icon: I.phone, label: card.phone, href: `tel:${card.phone}` } : null,
    card.email ? { icon: I.mail, label: card.email, href: `mailto:${card.email}` } : null,
    card.website ? { icon: I.globe, label: trimUrl(card.website), href: card.website } : null,
    card.instagram ? { icon: I.instagram, label: card.instagram, href: `https://instagram.com/${card.instagram.replace('@', '')}` } : null,
    card.facebook ? { icon: I.facebook, label: trimUrl(card.facebook), href: card.facebook } : null,
    card.linkedin ? { icon: I.linkedin, label: 'LinkedIn', href: card.linkedin } : null,
    card.tiktok ? { icon: I.tiktok, label: card.tiktok, href: `https://tiktok.com/@${card.tiktok.replace('@', '')}` } : null,
    card.twitter ? { icon: I.twitter, label: card.twitter, href: `https://x.com/${card.twitter.replace('@', '')}` } : null,
    card.youtube ? { icon: I.youtube, label: 'YouTube', href: card.youtube } : null,
    card.whatsapp ? { icon: I.whatsapp, label: card.whatsapp, href: `https://wa.me/${card.whatsapp.replace(/\D/g, '')}` } : null,
    card.threads ? { icon: I.threads, label: card.threads, href: `https://threads.net/@${card.threads.replace('@', '')}` } : null,
    card.address ? { icon: I.pin, label: card.address } : null,
  ].filter(Boolean) as ContactEntry[];

const ContactRow = ({ entry, light = false, accentColor, small = false }: { entry: ContactEntry; light?: boolean; accentColor: string; small?: boolean }) => {
  const Icon = entry.icon;
  const sz = small ? 9 : 11;
  const ts = small ? 'text-[8px]' : 'text-[10px]';
  const inner = (
    <span className="flex items-center gap-1.5 min-w-0">
      <span className="shrink-0" style={{ color: light ? 'rgba(255,255,255,0.6)' : darken(accentColor, 0.1) }}><Icon size={sz} /></span>
      <span className={`truncate ${ts} leading-none`} style={{ color: light ? 'rgba(255,255,255,0.8)' : undefined }}>{entry.label}</span>
    </span>
  );
  if (entry.href) return <a href={entry.href} target="_blank" rel="noopener noreferrer" className="block py-[2px] hover:opacity-80 transition-opacity">{inner}</a>;
  return <div className="py-[2px]">{inner}</div>;
};

const CardPreview: React.FC<CardPreviewProps> = ({ card, cardRef }) => {
  const { fullName, title, businessName, photo, accentColor, cardStyle, showInitials } = card;
  const accent = accentColor || '#2D3748';
  const displayName = businessName || fullName || 'Your Name';
  const secondaryName = businessName && fullName && businessName !== displayName ? fullName : undefined;
  const initials = getInitials(fullName || businessName || 'Your Name');
  const si = showInitials !== false;
  const contacts = buildContacts(card);
  const hasContact = contacts.length > 0;
  const sm = contacts.length > 6;

  // ── MONOGRAM ──
  if (cardStyle === 'modern') {
    return (
      <div ref={cardRef} className="w-full overflow-hidden rounded-xl bg-white transition-all duration-300" style={{ maxWidth: 400, aspectRatio: '1.75 / 1', boxShadow: `0 8px 32px -8px ${withAlpha(accent, 0.2)}, 0 0 0 1px ${withAlpha(accent, 0.06)}` }}>
        <div className="grid h-full" style={{ gridTemplateColumns: si ? '88px 1fr' : '1fr' }}>
          {si && (
            <div className="relative flex flex-col items-center justify-between overflow-hidden py-4 px-2" style={{ background: `linear-gradient(170deg, ${accent}, ${darken(accent, 0.2)})` }}>
              <div className="relative z-10 flex h-[56px] w-[56px] items-center justify-center rounded-lg text-[20px] font-semibold tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)' }}>
                {initials}
              </div>
              {photo && <img src={photo} alt="" className="h-8 w-8 rounded-full object-cover" style={{ border: '1.5px solid rgba(255,255,255,0.2)' }} />}
              {!photo && <div className="h-px w-8" style={{ background: 'rgba(255,255,255,0.2)' }} />}
            </div>
          )}
          <div className="relative flex flex-col justify-between py-3 px-3.5">
            {!si && <div className="absolute top-0 left-0 w-full h-[2.5px]" style={{ background: accent }} />}
            <div className="min-w-0 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="truncate text-[16px] font-semibold leading-tight tracking-tight" style={{ color: '#1a1a1a' }}>{displayName}</h2>
                {title && <p className="mt-0.5 text-[9px] text-gray-500">{title}</p>}
                {secondaryName && <p className="mt-0.5 text-[8px] text-gray-400">{secondaryName}</p>}
              </div>
              {!si && photo && <img src={photo} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" style={{ border: `1px solid ${withAlpha(accent, 0.1)}` }} />}
            </div>
            {hasContact && (
              <div className="mt-1.5 grid grid-cols-2 gap-x-3">
                {contacts.slice(0, 8).map(e => <ContactRow key={e.label} entry={e} accentColor={accent} small={sm} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── WORDMARK ──
  if (cardStyle === 'clean') {
    return (
      <div ref={cardRef} className="relative w-full overflow-hidden rounded-xl bg-white transition-all duration-300" style={{ maxWidth: 400, aspectRatio: '1.75 / 1', boxShadow: '0 4px 20px -6px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)' }}>
        <div className="absolute left-3 top-3 h-3.5 w-3.5 rounded-tl border-l-[1.5px] border-t-[1.5px]" style={{ borderColor: withAlpha(accent, 0.3) }} />
        <div className="absolute bottom-3 right-3 h-3.5 w-3.5 rounded-br border-b-[1.5px] border-r-[1.5px]" style={{ borderColor: withAlpha(accent, 0.3) }} />
        <div className="relative z-10 flex h-full flex-col justify-between p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-[17px] font-semibold leading-none tracking-tight" style={{ color: '#1a1a1a' }}>{displayName}</h2>
                {si && <span className="inline-flex h-5 items-center rounded px-1.5 text-[8px] font-bold tracking-[0.15em]" style={{ background: withAlpha(accent, 0.08), color: darken(accent, 0.1) }}>{initials}</span>}
              </div>
              {title && <p className="mt-1 text-[9px] text-gray-500">{title}</p>}
              {secondaryName && <p className="mt-0.5 text-[8px] uppercase tracking-[0.1em] text-gray-400">{secondaryName}</p>}
            </div>
            {photo && <img src={photo} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" style={{ border: `1px solid ${withAlpha(accent, 0.1)}` }} />}
          </div>
          <div className="h-px my-1.5" style={{ background: `linear-gradient(90deg, ${accent}, ${withAlpha(accent, 0.05)})` }} />
          <div className="grid grid-cols-[1fr_1.1fr] gap-3">
            <div className="flex flex-col justify-between min-w-0">
              {card.address && <p className="text-[8px] leading-[1.4] text-gray-400">{card.address}</p>}
              <div className="h-px w-8 mt-1" style={{ background: withAlpha(accent, 0.12) }} />
            </div>
            {hasContact && (
              <div>
                {contacts.filter(e => e.icon !== I.pin).slice(0, 6).map(e => <ContactRow key={e.label} entry={e} accentColor={accent} small={sm} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── FULL BLEED ──
  if (cardStyle === 'bold') {
    return (
      <div ref={cardRef} className="w-full overflow-hidden rounded-xl transition-all duration-300" style={{ maxWidth: 400, aspectRatio: '1.75 / 1', boxShadow: `0 12px 36px -8px ${withAlpha(accent, 0.35)}` }}>
        <div className="relative h-full overflow-hidden" style={{ background: `linear-gradient(150deg, ${darken(accent, 0.3)}, ${accent})` }}>
          {si && <div className="absolute -right-1 -top-1 text-[72px] font-bold leading-none tracking-[0.06em] select-none" style={{ color: 'rgba(255,255,255,0.04)' }}>{initials}</div>}
          <div className="relative z-10 flex h-full flex-col justify-between p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 pt-0.5">
                <h2 className="truncate text-[19px] font-semibold leading-none tracking-tight" style={{ color: 'rgba(255,255,255,0.95)' }}>{displayName}</h2>
                {title && <p className="mt-1 text-[9px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{title}</p>}
                {secondaryName && <p className="mt-0.5 text-[8px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{secondaryName}</p>}
              </div>
              {photo ? (
                <img src={photo} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" style={{ border: '1.5px solid rgba(255,255,255,0.15)' }} />
              ) : si ? (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[15px] font-semibold tracking-[0.1em]" style={{ border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)' }}>{initials}</div>
              ) : null}
            </div>
            {hasContact && (
              <div className="rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="grid grid-cols-2 gap-x-3">
                  {contacts.slice(0, 8).map(e => <ContactRow key={e.label} entry={e} accentColor={accent} light small={sm} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── EDITORIAL ──
  if (cardStyle === 'minimal') {
    return (
      <div ref={cardRef} className="w-full overflow-hidden rounded-xl transition-all duration-300" style={{ maxWidth: 400, aspectRatio: '1.75 / 1', boxShadow: '0 2px 16px -4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)' }}>
        <div className="relative h-full bg-white flex flex-col justify-between p-5">
          <div className="absolute top-0 left-0 w-full h-[2.5px]" style={{ background: accent }} />
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-[22px] font-light leading-none tracking-tight" style={{ color: '#1a1a1a' }}>{displayName}</h2>
                {title && <p className="mt-2 text-[9px] font-medium tracking-[0.2em] uppercase" style={{ color: accent }}>{title}</p>}
                {secondaryName && <p className="mt-1 text-[9px] text-gray-400">{secondaryName}</p>}
              </div>
              {photo && <img src={photo} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover grayscale hover:grayscale-0 transition-all" style={{ border: `1.5px solid ${withAlpha(accent, 0.12)}` }} />}
            </div>
          </div>
          {hasContact && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-0">
              {contacts.slice(0, 8).map(e => {
                const Icon = e.icon;
                const inner = (
                  <span className="flex items-center gap-1.5 py-[2.5px]">
                    <span style={{ color: accent }}><Icon size={10} /></span>
                    <span className="text-[9px] text-gray-500 truncate">{e.label}</span>
                  </span>
                );
                return e.href ? <a key={e.label} href={e.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">{inner}</a> : <div key={e.label}>{inner}</div>;
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── DARK MODE ──
  return (
    <div ref={cardRef} className="w-full overflow-hidden rounded-xl transition-all duration-300" style={{ maxWidth: 400, aspectRatio: '1.75 / 1', boxShadow: `0 0 32px -4px ${withAlpha(accent, 0.25)}, 0 0 0 1px ${withAlpha(accent, 0.15)}` }}>
      <div className="relative h-full overflow-hidden" style={{ background: '#111114' }}>
        <div className="absolute top-[-15%] right-[-8%] w-[40%] h-[50%] rounded-full" style={{ background: `radial-gradient(circle, ${withAlpha(accent, 0.18)}, transparent 70%)`, filter: 'blur(20px)' }} />
        <div className="absolute bottom-[-15%] left-[10%] w-[35%] h-[40%] rounded-full" style={{ background: `radial-gradient(circle, ${withAlpha(lighten(accent, 0.2), 0.1)}, transparent 70%)`, filter: 'blur(16px)' }} />
        <div className="absolute inset-0 rounded-xl" style={{ boxShadow: `inset 0 0 0 1px ${withAlpha(accent, 0.2)}` }} />
        <div className="relative z-10 flex h-full flex-col justify-between p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-[19px] font-semibold leading-none" style={{ color: lighten(accent, 0.6) }}>{displayName}</h2>
              {title && <p className="mt-1.5 text-[9px] font-medium tracking-widest uppercase" style={{ color: withAlpha(accent, 0.55) }}>{title}</p>}
              {secondaryName && <p className="mt-0.5 text-[8px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{secondaryName}</p>}
            </div>
            {photo ? (
              <img src={photo} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" style={{ border: `1.5px solid ${withAlpha(accent, 0.3)}` }} />
            ) : si ? (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[15px] font-semibold tracking-widest" style={{ border: `1.5px solid ${withAlpha(accent, 0.25)}`, background: withAlpha(accent, 0.06), color: withAlpha(accent, 0.7) }}>{initials}</div>
            ) : null}
          </div>
          {hasContact && (
            <div className="rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${withAlpha(accent, 0.12)}` }}>
              <div className="grid grid-cols-2 gap-x-3">
                {contacts.slice(0, 8).map(e => {
                  const Icon = e.icon;
                  const inner = (
                    <span className="flex items-center gap-1.5 min-w-0">
                      <span style={{ color: withAlpha(accent, 0.6) }}><Icon size={sm ? 9 : 11} /></span>
                      <span className={`truncate ${sm ? 'text-[8px]' : 'text-[10px]'} leading-none`} style={{ color: 'rgba(255,255,255,0.55)' }}>{e.label}</span>
                    </span>
                  );
                  return e.href ? <a key={e.label} href={e.href} target="_blank" rel="noopener noreferrer" className="block py-[2px] hover:opacity-80 transition-opacity">{inner}</a> : <div key={e.label} className="py-[2px]">{inner}</div>;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
