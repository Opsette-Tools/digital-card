import React from 'react';
import { CardData } from '@/types/card';
import { Phone, Mail, Globe, Instagram, Facebook, MapPin } from 'lucide-react';

interface CardPreviewProps {
  card: CardData;
  cardRef?: React.RefObject<HTMLDivElement>;
}

type ContactEntry = {
  icon: React.ElementType;
  label: string;
  href?: string;
};

const getInitials = (value: string) => {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'YN';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

const normalizeHex = (hex: string) => {
  const value = hex.replace('#', '');
  if (value.length === 3) {
    return `#${value.split('').map(char => char + char).join('')}`;
  }
  return `#${value.padEnd(6, '0').slice(0, 6)}`;
};

const hexToRgb = (hex: string) => {
  const safe = normalizeHex(hex).replace('#', '');
  return {
    r: parseInt(safe.slice(0, 2), 16),
    g: parseInt(safe.slice(2, 4), 16),
    b: parseInt(safe.slice(4, 6), 16),
  };
};

const withAlpha = (hex: string, alpha: number) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const blend = (hex: string, target: number, amount: number) => {
  const { r, g, b } = hexToRgb(hex);
  const mix = (channel: number) => Math.round(channel + (target - channel) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};

const lighten = (hex: string, amount: number) => blend(hex, 255, amount);
const darken = (hex: string, amount: number) => blend(hex, 0, amount);
const trimUrl = (value: string) => value.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

const ContactTile = ({ entry, accentColor, tone = 'light' }: { entry: ContactEntry; accentColor: string; tone?: 'light' | 'dark' }) => {
  const Icon = entry.icon;
  const wrapperClass = 'block min-w-0 rounded-[16px] border px-2.5 py-2 transition-transform duration-300 hover:-translate-y-[1px]';
  const inner = (
    <span className="flex items-center gap-2 min-w-0">
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        style={tone === 'dark'
          ? { background: withAlpha('#ffffff', 0.14), color: withAlpha('#ffffff', 0.92) }
          : { background: withAlpha(accentColor, 0.12), color: darken(accentColor, 0.18) }}
      >
        <Icon size={12} />
      </span>
      <span
        className="truncate text-[10.5px] font-medium leading-none"
        style={tone === 'dark' ? { color: withAlpha('#ffffff', 0.9) } : undefined}
      >
        {entry.label}
      </span>
    </span>
  );

  const wrapperStyle = tone === 'dark'
    ? {
        background: withAlpha('#ffffff', 0.08),
        borderColor: withAlpha('#ffffff', 0.12),
      }
    : {
        background: 'hsl(var(--background))',
        borderColor: withAlpha(accentColor, 0.14),
        boxShadow: `0 1px 0 ${withAlpha(accentColor, 0.06)}`,
      };

  if (entry.href) {
    return (
      <a href={entry.href} target="_blank" rel="noopener noreferrer" className={wrapperClass} style={wrapperStyle}>
        {inner}
      </a>
    );
  }

  return (
    <div className={wrapperClass} style={wrapperStyle}>
      {inner}
    </div>
  );
};

const CardPreview: React.FC<CardPreviewProps> = ({ card, cardRef }) => {
  const { fullName, title, businessName, phone, email, website, instagram, facebook, address, photo, accentColor, cardStyle } = card;

  const accent = accentColor || '#1a1a2e';
  const displayName = businessName || fullName || 'Your Name';
  const secondaryName = businessName && fullName && businessName !== displayName ? fullName : undefined;
  const initials = getInitials(fullName || businessName || 'Your Name');
  const contactEntries: ContactEntry[] = [
    phone ? { icon: Phone, label: phone, href: `tel:${phone}` } : null,
    email ? { icon: Mail, label: email, href: `mailto:${email}` } : null,
    website ? { icon: Globe, label: trimUrl(website), href: website } : null,
    instagram ? { icon: Instagram, label: instagram, href: `https://instagram.com/${instagram.replace('@', '')}` } : null,
    facebook ? { icon: Facebook, label: trimUrl(facebook), href: facebook } : null,
    address ? { icon: MapPin, label: address } : null,
  ].filter(Boolean) as ContactEntry[];
  const nonAddressEntries = contactEntries.filter(entry => entry.icon !== MapPin);
  const hasContact = contactEntries.length > 0;
  const shadowColor = withAlpha(accent, 0.28);

  if (cardStyle === 'modern') {
    return (
      <div
        ref={cardRef}
        className="w-full overflow-hidden rounded-[28px] border border-border/60 bg-card transition-all duration-500"
        style={{ maxWidth: 400, aspectRatio: '1.75 / 1', boxShadow: `0 24px 48px -24px ${shadowColor}` }}
      >
        <div className="grid h-full grid-cols-[132px_1fr]">
          <div className="relative flex flex-col justify-between overflow-hidden p-5" style={{ background: `linear-gradient(165deg, ${accent}, ${darken(accent, 0.22)})` }}>
            <div className="absolute -right-5 top-3 h-20 w-20 rounded-full" style={{ background: withAlpha('#ffffff', 0.08) }} />
            <div className="absolute -left-4 bottom-4 h-24 w-24 rounded-full" style={{ background: withAlpha('#ffffff', 0.06) }} />
            <div className="relative z-10 flex h-[94px] w-[94px] items-center justify-center rounded-[26px] border text-[34px] font-semibold tracking-[0.18em]" style={{ color: withAlpha('#ffffff', 0.94), borderColor: withAlpha('#ffffff', 0.18), background: withAlpha('#ffffff', 0.08) }}>
              {initials}
            </div>
            <div className="relative z-10 flex items-end justify-between">
              <div className="h-px w-14" style={{ background: withAlpha('#ffffff', 0.3) }} />
              {photo && (
                <div className="rounded-full p-[3px]" style={{ background: withAlpha('#ffffff', 0.16) }}>
                  <img src={photo} alt={fullName || displayName} className="h-11 w-11 rounded-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="relative flex h-full flex-col justify-between bg-card p-5">
            <div className="absolute inset-y-5 left-0 w-px" style={{ background: `linear-gradient(to bottom, ${withAlpha(accent, 0)}, ${withAlpha(accent, 0.24)}, ${withAlpha(accent, 0)})` }} />
            <div className="min-w-0">
              <h2 className="truncate text-[22px] font-semibold leading-none tracking-tight text-card-foreground">{displayName}</h2>
              {title && <p className="mt-2 text-[12px] font-medium text-muted-foreground">{title}</p>}
              {secondaryName && <p className="mt-1 text-[11px] text-muted-foreground/80">{secondaryName}</p>}
            </div>

            {hasContact ? (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {contactEntries.slice(0, 6).map(entry => (
                  <ContactTile key={`${entry.label}-${entry.href ?? 'text'}`} entry={entry} accentColor={accent} />
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-[18px] border border-border/60 bg-background px-3 py-3">
                <div className="h-px w-12" style={{ background: withAlpha(accent, 0.25) }} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (cardStyle === 'clean') {
    return (
      <div
        ref={cardRef}
        className="relative w-full overflow-hidden rounded-[28px] border border-border/60 bg-card transition-all duration-500"
        style={{ maxWidth: 400, aspectRatio: '1.75 / 1', boxShadow: `0 22px 44px -26px ${shadowColor}` }}
      >
        <div className="absolute left-5 top-5 h-6 w-6 rounded-tl-[12px] border-l-2 border-t-2" style={{ borderColor: withAlpha(accent, 0.45) }} />
        <div className="absolute bottom-5 right-5 h-6 w-6 rounded-br-[12px] border-b-2 border-r-2" style={{ borderColor: withAlpha(accent, 0.45) }} />
        <div className="relative z-10 flex h-full flex-col p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-[23px] font-semibold leading-none tracking-tight text-card-foreground">{displayName}</h2>
                <span className="inline-flex h-8 items-center rounded-full border px-3 text-[11px] font-semibold tracking-[0.22em]" style={{ borderColor: withAlpha(accent, 0.18), background: withAlpha(accent, 0.1), color: darken(accent, 0.18) }}>
                  {initials}
                </span>
              </div>
              {title && <p className="mt-2 text-[12px] text-muted-foreground">{title}</p>}
              {secondaryName && <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">{secondaryName}</p>}
            </div>
            {photo && <img src={photo} alt={fullName || displayName} className="h-14 w-14 shrink-0 rounded-[18px] border object-cover" style={{ borderColor: withAlpha(accent, 0.18) }} />}
          </div>

          <div className="my-4 h-px" style={{ background: `linear-gradient(90deg, ${accent}, ${withAlpha(accent, 0.1)})` }} />

          <div className="grid flex-1 grid-cols-[1fr_1.1fr] gap-4">
            <div className="flex min-w-0 flex-col justify-between">
              <div className="space-y-2">
                {fullName && businessName && businessName !== fullName && <p className="text-[13px] font-medium text-card-foreground">{fullName}</p>}
                {address && <p className="text-[11px] leading-4 text-muted-foreground">{address}</p>}
                {!address && !secondaryName && !title && <div className="h-10 rounded-[16px]" style={{ background: withAlpha(accent, 0.06) }} />}
              </div>
              <div className="h-px w-16" style={{ background: withAlpha(accent, 0.2) }} />
            </div>

            {nonAddressEntries.length > 0 ? (
              <div className="grid content-start gap-2">
                {nonAddressEntries.slice(0, 4).map(entry => (
                  <ContactTile key={`${entry.label}-${entry.href ?? 'text'}`} entry={entry} accentColor={accent} />
                ))}
              </div>
            ) : (
              <div className="rounded-[18px] border border-border/60 bg-background" />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className="w-full overflow-hidden rounded-[28px] transition-all duration-500"
      style={{ maxWidth: 400, aspectRatio: '1.75 / 1', boxShadow: `0 28px 56px -28px ${withAlpha(accent, 0.44)}` }}
    >
      <div className="relative h-full overflow-hidden" style={{ background: `linear-gradient(145deg, ${darken(accent, 0.45)}, ${accent})` }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at top right, ${withAlpha('#ffffff', 0.14)}, transparent 34%)` }} />
        <div className="absolute -right-4 top-1 text-[96px] font-semibold leading-none tracking-[0.12em]" style={{ color: withAlpha('#ffffff', 0.06) }}>
          {initials}
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate text-[24px] font-semibold leading-none tracking-tight" style={{ color: withAlpha('#ffffff', 0.96) }}>
                {displayName}
              </h2>
              {title && <p className="mt-2 text-[12px]" style={{ color: withAlpha('#ffffff', 0.74) }}>{title}</p>}
              {secondaryName && <p className="mt-1 text-[11px]" style={{ color: withAlpha('#ffffff', 0.56) }}>{secondaryName}</p>}
            </div>

            {photo ? (
              <img src={photo} alt={fullName || displayName} className="h-16 w-16 shrink-0 rounded-[18px] border object-cover" style={{ borderColor: withAlpha('#ffffff', 0.18) }} />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] border text-[20px] font-semibold tracking-[0.16em]" style={{ borderColor: withAlpha('#ffffff', 0.14), background: withAlpha('#ffffff', 0.08), color: withAlpha('#ffffff', 0.9) }}>
                {initials}
              </div>
            )}
          </div>

          <div className="rounded-[22px] border px-4 py-3" style={{ background: `linear-gradient(180deg, ${withAlpha('#ffffff', 0.12)}, ${withAlpha('#ffffff', 0.08)})`, borderColor: withAlpha('#ffffff', 0.14), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
            {hasContact ? (
              <div className="grid grid-cols-2 gap-2">
                {contactEntries.slice(0, 6).map(entry => (
                  <ContactTile key={`${entry.label}-${entry.href ?? 'text'}`} entry={entry} accentColor={accent} tone="dark" />
                ))}
              </div>
            ) : (
              <div className="h-14 rounded-[16px] border" style={{ borderColor: withAlpha('#ffffff', 0.12), background: withAlpha('#ffffff', 0.05) }} />
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${lighten(accent, 0.28)}, ${withAlpha('#ffffff', 0.45)}, ${lighten(accent, 0.28)})` }} />
      </div>
    </div>
  );
};

export default CardPreview;
