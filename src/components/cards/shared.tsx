import React from 'react';
import { CardData } from '@/types/card';
import type { Dimensions } from '@/lib/print';

export interface CardTemplateProps {
  card: CardData;
  cardRef?: React.RefObject<HTMLDivElement>;
  /** When present, business templates use this aspect ratio instead of the legacy 1.75/1. */
  dimensions?: Dimensions;
}

export type ContactEntry = { icon: React.FC<{ size?: number; style?: React.CSSProperties }>; label: string; href?: string };

export const getInitials = (value: string) => {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'YN';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

export const hexToRgb = (hex: string) => {
  const h = hex.replace('#', '').padEnd(6, '0').slice(0, 6);
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
};
export const withAlpha = (hex: string, a: number) => { const { r, g, b } = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; };
export const blend = (hex: string, t: number, a: number) => { const { r, g, b } = hexToRgb(hex); const m = (c: number) => Math.round(c + (t - c) * a); return `rgb(${m(r)},${m(g)},${m(b)})`; };
export const darken = (hex: string, a: number) => blend(hex, 0, a);
export const lighten = (hex: string, a: number) => blend(hex, 255, a);
export const trimUrl = (v: string) => v.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

// Minimal SVG icons
const s = 'currentColor';
export const Icons = {
  phone: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><path d="M6.5 2.5h3M8 12.5v.5M5 1h6a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V2a1 1 0 011-1z" stroke={s} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  mail: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><rect x="1" y="3" width="14" height="10" rx="1.5" stroke={s} strokeWidth="1.2"/><path d="M1 4.5l7 4.5 7-4.5" stroke={s} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  globe: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><circle cx="8" cy="8" r="6.5" stroke={s} strokeWidth="1.2"/><path d="M1.5 8h13M8 1.5c-2 2.5-2 9.5 0 13M8 1.5c2 2.5 2 9.5 0 13" stroke={s} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  instagram: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><rect x="2" y="2" width="12" height="12" rx="3.5" stroke={s} strokeWidth="1.2"/><circle cx="8" cy="8" r="3" stroke={s} strokeWidth="1.2"/><circle cx="11.5" cy="4.5" r="0.75" fill={s}/></svg>,
  facebook: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><path d="M9.5 2.5H11V0H9.5a3 3 0 00-3 3v1.5H5V7h1.5v9h3V7h2L12 4.5H9.5V3.5a1 1 0 011-1z" stroke={s} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  linkedin: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><rect x="2" y="2" width="12" height="12" rx="2" stroke={s} strokeWidth="1.2"/><path d="M5.5 7v3.5M8 10.5V8.5a1.5 1.5 0 013 0v2M5.5 5.5v0" stroke={s} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  tiktok: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><path d="M10 2v8a3.5 3.5 0 11-2.5-3.35M10 2h2a3 3 0 003 3" stroke={s} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  twitter: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><path d="M12.5 2L8.2 7.4M3.5 14l4.3-5.4M3.5 2l5.7 7.4L12.5 14" stroke={s} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  youtube: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><rect x="1.5" y="3" width="13" height="10" rx="3" stroke={s} strokeWidth="1.2"/><path d="M6.5 6l3.5 2-3.5 2z" fill={s}/></svg>,
  whatsapp: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><path d="M8 1.5a6.5 6.5 0 00-5.6 9.8L1.5 14.5l3.3-.9A6.5 6.5 0 108 1.5z" stroke={s} strokeWidth="1.2"/><path d="M6 6.5a1 1 0 011-1h.5l1.5 2-1 1 1.5 1.5 1-1 2 1.5v.5a1 1 0 01-1 1c-2 0-5.5-3-5.5-5.5z" stroke={s} strokeWidth="0.8"/></svg>,
  threads: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><path d="M10.5 4C9 2.5 6.5 3 6 5s.5 3 2.5 3 3-.5 3-2.5S10 3 8 3s-4 2-4 5 2.5 5 4.5 5 3-1 3.5-2.5" stroke={s} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  pin: ({ size = 11, style }: { size?: number; style?: React.CSSProperties }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}><path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.5-2-4.5-4.5-4.5z" stroke={s} strokeWidth="1.2"/><circle cx="8" cy="6" r="1.5" stroke={s} strokeWidth="1.2"/></svg>,
};

export const buildContacts = (card: CardData): ContactEntry[] =>
  [
    card.phone ? { icon: Icons.phone, label: card.phone, href: `tel:${card.phone}` } : null,
    card.email ? { icon: Icons.mail, label: card.email, href: `mailto:${card.email}` } : null,
    card.website ? { icon: Icons.globe, label: trimUrl(card.website), href: card.website } : null,
    card.instagram ? { icon: Icons.instagram, label: card.instagram, href: `https://instagram.com/${card.instagram.replace('@', '')}` } : null,
    card.facebook ? { icon: Icons.facebook, label: trimUrl(card.facebook), href: card.facebook } : null,
    card.linkedin ? { icon: Icons.linkedin, label: 'LinkedIn', href: card.linkedin } : null,
    card.tiktok ? { icon: Icons.tiktok, label: card.tiktok, href: `https://tiktok.com/@${card.tiktok.replace('@', '')}` } : null,
    card.twitter ? { icon: Icons.twitter, label: card.twitter, href: `https://x.com/${card.twitter.replace('@', '')}` } : null,
    card.youtube ? { icon: Icons.youtube, label: 'YouTube', href: card.youtube } : null,
    card.whatsapp ? { icon: Icons.whatsapp, label: card.whatsapp, href: `https://wa.me/${card.whatsapp.replace(/\D/g, '')}` } : null,
    card.threads ? { icon: Icons.threads, label: card.threads, href: `https://threads.net/@${card.threads.replace('@', '')}` } : null,
    card.address ? { icon: Icons.pin, label: card.address } : null,
  ].filter(Boolean) as ContactEntry[];

/** Splits contacts so address gets its own full-width row, with the icon grid capped. */
export const splitContacts = (card: CardData, max = 6): { items: ContactEntry[]; address?: ContactEntry } => {
  const all = buildContacts(card);
  const address = all.find(e => e.icon === Icons.pin);
  const rest = all.filter(e => e.icon !== Icons.pin).slice(0, max);
  return { items: rest, address };
};

// Social-only contacts (for icon rows)
export const buildSocials = (card: CardData): ContactEntry[] =>
  [
    card.instagram ? { icon: Icons.instagram, label: card.instagram, href: `https://instagram.com/${card.instagram.replace('@', '')}` } : null,
    card.facebook ? { icon: Icons.facebook, label: 'Facebook', href: card.facebook } : null,
    card.linkedin ? { icon: Icons.linkedin, label: 'LinkedIn', href: card.linkedin } : null,
    card.tiktok ? { icon: Icons.tiktok, label: card.tiktok, href: `https://tiktok.com/@${card.tiktok.replace('@', '')}` } : null,
    card.twitter ? { icon: Icons.twitter, label: card.twitter, href: `https://x.com/${card.twitter.replace('@', '')}` } : null,
    card.youtube ? { icon: Icons.youtube, label: 'YouTube', href: card.youtube } : null,
    card.whatsapp ? { icon: Icons.whatsapp, label: card.whatsapp, href: `https://wa.me/${card.whatsapp.replace(/\D/g, '')}` } : null,
    card.threads ? { icon: Icons.threads, label: card.threads, href: `https://threads.net/@${card.threads.replace('@', '')}` } : null,
  ].filter(Boolean) as ContactEntry[];

export const ContactRow = ({ entry, light = false, accentColor, small = false }: { entry: ContactEntry; light?: boolean; accentColor: string; small?: boolean }) => {
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
