import React from 'react';
import { CardTemplateProps, getInitials, withAlpha, darken, lighten, splitContacts, ContactRow, Icons } from './shared';

export const MonogramCard: React.FC<CardTemplateProps> = ({ card, cardRef, dimensions }) => {
  const { fullName, title, businessName, photo, accentColor, showInitials } = card;
  const accent = accentColor || '#2D3748';
  const initials = getInitials(fullName || 'Your Name');
  const si = showInitials !== false;
  const { items, address } = splitContacts(card, 6);
  const sm = items.length > 4;
  const ar = dimensions?.aspectRatio ?? '1.75 / 1';

  return (
    <div ref={cardRef} className="w-full overflow-hidden rounded-xl bg-white transition-all duration-300" style={{ maxWidth: 400, aspectRatio: ar, boxShadow: `0 8px 32px -8px ${withAlpha(accent, 0.2)}, 0 0 0 1px ${withAlpha(accent, 0.06)}` }}>
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
        <div className="relative flex flex-col justify-between py-3 px-3.5 min-w-0">
          {!si && <div className="absolute top-0 left-0 w-full h-[2.5px]" style={{ background: accent }} />}
          <div className="min-w-0 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate text-[16px] font-semibold leading-tight tracking-tight" style={{ color: '#1a1a1a' }}>{fullName || 'Your Name'}</h2>
              {title && <p className="mt-0.5 text-[9px] text-gray-500 truncate">{title}</p>}
              {businessName && <p className="mt-0.5 text-[11px] font-medium truncate" style={{ color: darken(accent, 0.05) }}>{businessName}</p>}
            </div>
            {!si && photo && <img src={photo} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" style={{ border: `1px solid ${withAlpha(accent, 0.1)}` }} />}
          </div>
          <div className="min-w-0">
            {items.length > 0 && (
              <div className="grid grid-cols-2 gap-x-3">
                {items.map(e => <ContactRow key={e.label} entry={e} accentColor={accent} small={sm} />)}
              </div>
            )}
            {address && (
              <div className="mt-1 pt-1 border-t" style={{ borderColor: withAlpha(accent, 0.08) }}>
                <ContactRow entry={address} accentColor={accent} small />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const WordmarkCard: React.FC<CardTemplateProps> = ({ card, cardRef, dimensions }) => {
  const { fullName, title, businessName, photo, accentColor, showInitials } = card;
  const accent = accentColor || '#2D3748';
  const initials = getInitials(fullName || 'Your Name');
  const si = showInitials !== false;
  const { items, address } = splitContacts(card, 4);
  const sm = items.length > 3;
  const ar = dimensions?.aspectRatio ?? '1.75 / 1';

  return (
    <div ref={cardRef} className="relative w-full overflow-hidden rounded-xl bg-white transition-all duration-300" style={{ maxWidth: 400, aspectRatio: ar, boxShadow: '0 4px 20px -6px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)' }}>
      <div className="absolute left-3 top-3 h-3.5 w-3.5 rounded-tl border-l-[1.5px] border-t-[1.5px]" style={{ borderColor: withAlpha(accent, 0.3) }} />
      <div className="absolute bottom-3 right-3 h-3.5 w-3.5 rounded-br border-b-[1.5px] border-r-[1.5px]" style={{ borderColor: withAlpha(accent, 0.3) }} />
      <div className="relative z-10 flex h-full flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="truncate text-[17px] font-semibold leading-none tracking-tight" style={{ color: '#1a1a1a' }}>{fullName || 'Your Name'}</h2>
              {si && <span className="inline-flex h-5 items-center rounded px-1.5 text-[8px] font-bold tracking-[0.15em] shrink-0" style={{ background: withAlpha(accent, 0.08), color: darken(accent, 0.1) }}>{initials}</span>}
            </div>
            {title && <p className="mt-1 text-[9px] text-gray-500 truncate">{title}</p>}
            {businessName && <p className="mt-0.5 text-[11px] font-medium truncate" style={{ color: darken(accent, 0.05) }}>{businessName}</p>}
          </div>
          {photo && <img src={photo} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" style={{ border: `1px solid ${withAlpha(accent, 0.1)}` }} />}
        </div>
        <div className="h-px my-1.5" style={{ background: `linear-gradient(90deg, ${accent}, ${withAlpha(accent, 0.05)})` }} />
        <div className="min-w-0">
          {items.length > 0 && (
            <div className="grid grid-cols-2 gap-x-3">
              {items.map(e => <ContactRow key={e.label} entry={e} accentColor={accent} small={sm} />)}
            </div>
          )}
          {address && (
            <div className="mt-1 pt-1 border-t" style={{ borderColor: withAlpha(accent, 0.08) }}>
              <ContactRow entry={address} accentColor={accent} small />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const FullBleedCard: React.FC<CardTemplateProps> = ({ card, cardRef, dimensions }) => {
  const { fullName, title, businessName, photo, accentColor, showInitials } = card;
  const accent = accentColor || '#2D3748';
  const initials = getInitials(fullName || 'Your Name');
  const si = showInitials !== false;
  const { items, address } = splitContacts(card, 6);
  const sm = items.length > 4;
  const ar = dimensions?.aspectRatio ?? '1.75 / 1';

  return (
    <div ref={cardRef} className="w-full overflow-hidden rounded-xl transition-all duration-300" style={{ maxWidth: 400, aspectRatio: ar, boxShadow: `0 12px 36px -8px ${withAlpha(accent, 0.35)}` }}>
      <div className="relative h-full overflow-hidden" style={{ background: `linear-gradient(150deg, ${darken(accent, 0.3)}, ${accent})` }}>
        {si && <div className="absolute -right-1 -top-1 text-[72px] font-bold leading-none tracking-[0.06em] select-none" style={{ color: 'rgba(255,255,255,0.04)' }}>{initials}</div>}
        <div className="relative z-10 flex h-full flex-col justify-between p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 pt-0.5">
              <h2 className="truncate text-[19px] font-semibold leading-none tracking-tight" style={{ color: 'rgba(255,255,255,0.95)' }}>{fullName || 'Your Name'}</h2>
              {title && <p className="mt-1 text-[9px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{title}</p>}
              {businessName && <p className="mt-0.5 text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{businessName}</p>}
            </div>
            {photo ? (
              <img src={photo} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" style={{ border: '1.5px solid rgba(255,255,255,0.15)' }} />
            ) : si ? (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[15px] font-semibold tracking-[0.1em]" style={{ border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)' }}>{initials}</div>
            ) : null}
          </div>
          <div className="rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {items.length > 0 && (
              <div className="grid grid-cols-2 gap-x-3">
                {items.map(e => <ContactRow key={e.label} entry={e} accentColor={accent} light small={sm} />)}
              </div>
            )}
            {address && (
              <div className={items.length > 0 ? 'mt-1 pt-1 border-t' : ''} style={items.length > 0 ? { borderColor: 'rgba(255,255,255,0.1)' } : undefined}>
                <ContactRow entry={address} accentColor={accent} light small />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const EditorialCard: React.FC<CardTemplateProps> = ({ card, cardRef, dimensions }) => {
  const { fullName, title, businessName, photo, accentColor } = card;
  const accent = accentColor || '#2D3748';
  const { items, address } = splitContacts(card, 6);
  const ar = dimensions?.aspectRatio ?? '1.75 / 1';

  return (
    <div ref={cardRef} className="w-full overflow-hidden rounded-xl transition-all duration-300" style={{ maxWidth: 400, aspectRatio: ar, boxShadow: '0 2px 16px -4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)' }}>
      <div className="relative h-full bg-white flex flex-col justify-between p-5">
        <div className="absolute top-0 left-0 w-full h-[2.5px]" style={{ background: accent }} />
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[22px] font-light leading-none tracking-tight" style={{ color: '#1a1a1a' }}>{fullName || 'Your Name'}</h2>
              {title && <p className="mt-2 text-[9px] font-medium tracking-[0.2em] uppercase" style={{ color: accent }}>{title}</p>}
              {businessName && <p className="mt-1 text-[11px] font-medium text-gray-500">{businessName}</p>}
            </div>
            {photo && <img src={photo} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover grayscale hover:grayscale-0 transition-all" style={{ border: `1.5px solid ${withAlpha(accent, 0.12)}` }} />}
          </div>
        </div>
        <div className="min-w-0">
          {items.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-0">
              {items.map(e => {
                const Icon = e.icon;
                const inner = (
                  <span className="flex items-center gap-1.5 py-[2.5px] min-w-0">
                    <span className="shrink-0" style={{ color: accent }}><Icon size={10} /></span>
                    <span className="text-[9px] text-gray-500 truncate">{e.label}</span>
                  </span>
                );
                return e.href ? <a key={e.label} href={e.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity block">{inner}</a> : <div key={e.label}>{inner}</div>;
              })}
            </div>
          )}
          {address && (
            <div className="mt-1 pt-1 border-t flex items-center gap-1.5 min-w-0" style={{ borderColor: withAlpha(accent, 0.08) }}>
              <span className="shrink-0" style={{ color: accent }}><Icons.pin size={10} /></span>
              <span className="text-[9px] text-gray-500 truncate">{address.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const DarkCard: React.FC<CardTemplateProps> = ({ card, cardRef, dimensions }) => {
  const { fullName, title, businessName, photo, accentColor, showInitials } = card;
  const accent = accentColor || '#2D3748';
  const initials = getInitials(fullName || 'Your Name');
  const si = showInitials !== false;
  const { items, address } = splitContacts(card, 6);
  const sm = items.length > 4;
  const ar = dimensions?.aspectRatio ?? '1.75 / 1';

  return (
    <div ref={cardRef} className="w-full overflow-hidden rounded-xl transition-all duration-300" style={{ maxWidth: 400, aspectRatio: ar, boxShadow: `0 0 32px -4px ${withAlpha(accent, 0.25)}, 0 0 0 1px ${withAlpha(accent, 0.15)}` }}>
      <div className="relative h-full overflow-hidden" style={{ background: '#111114' }}>
        <div className="absolute top-[-15%] right-[-8%] w-[40%] h-[50%] rounded-full" style={{ background: `radial-gradient(circle, ${withAlpha(accent, 0.18)}, transparent 70%)`, filter: 'blur(20px)' }} />
        <div className="absolute bottom-[-15%] left-[10%] w-[35%] h-[40%] rounded-full" style={{ background: `radial-gradient(circle, ${withAlpha(lighten(accent, 0.2), 0.1)}, transparent 70%)`, filter: 'blur(16px)' }} />
        <div className="absolute inset-0 rounded-xl" style={{ boxShadow: `inset 0 0 0 1px ${withAlpha(accent, 0.2)}` }} />
        <div className="relative z-10 flex h-full flex-col justify-between p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-[19px] font-semibold leading-none" style={{ color: lighten(accent, 0.6) }}>{fullName || 'Your Name'}</h2>
              {title && <p className="mt-1.5 text-[9px] font-medium tracking-widest uppercase" style={{ color: withAlpha(accent, 0.55) }}>{title}</p>}
              {businessName && <p className="mt-0.5 text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{businessName}</p>}
            </div>
            {photo ? (
              <img src={photo} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" style={{ border: `1.5px solid ${withAlpha(accent, 0.3)}` }} />
            ) : si ? (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[15px] font-semibold tracking-widest" style={{ border: `1.5px solid ${withAlpha(accent, 0.25)}`, background: withAlpha(accent, 0.06), color: withAlpha(accent, 0.7) }}>{initials}</div>
            ) : null}
          </div>
          <div className="rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${withAlpha(accent, 0.12)}` }}>
            {items.length > 0 && (
              <div className="grid grid-cols-2 gap-x-3">
                {items.map(e => {
                  const Icon = e.icon;
                  const inner = (
                    <span className="flex items-center gap-1.5 min-w-0">
                      <span className="shrink-0" style={{ color: withAlpha(accent, 0.6) }}><Icon size={sm ? 9 : 11} /></span>
                      <span className={`truncate ${sm ? 'text-[8px]' : 'text-[10px]'} leading-none`} style={{ color: 'rgba(255,255,255,0.55)' }}>{e.label}</span>
                    </span>
                  );
                  return e.href ? <a key={e.label} href={e.href} target="_blank" rel="noopener noreferrer" className="block py-[2px] hover:opacity-80 transition-opacity">{inner}</a> : <div key={e.label} className="py-[2px]">{inner}</div>;
                })}
              </div>
            )}
            {address && (
              <div className={`flex items-center gap-1.5 min-w-0 py-[2px] ${items.length > 0 ? 'mt-1 pt-1 border-t' : ''}`} style={items.length > 0 ? { borderColor: withAlpha(accent, 0.12) } : undefined}>
                <span className="shrink-0" style={{ color: withAlpha(accent, 0.6) }}><Icons.pin size={sm ? 9 : 11} /></span>
                <span className={`truncate ${sm ? 'text-[8px]' : 'text-[10px]'} leading-none`} style={{ color: 'rgba(255,255,255,0.55)' }}>{address.label}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
