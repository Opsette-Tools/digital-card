import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { CardTemplateProps, withAlpha, darken } from './shared';
import { resolveFontStack } from '@/lib/handout-fonts';

const DEFAULT_QR_TARGET = 'https://opsette.io';

const useInlineQr = (url: string, color: string): string => {
  const [data, setData] = useState('');
  useEffect(() => {
    let cancelled = false;
    const hex = color.replace('#', '').padEnd(6, '0').slice(0, 6);
    QRCode.toDataURL(url || DEFAULT_QR_TARGET, {
      width: 512,
      margin: 1,
      color: { dark: `#${hex}`, light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then(d => { if (!cancelled) setData(d); })
      .catch(() => { if (!cancelled) setData(''); });
    return () => { cancelled = true; };
  }, [url, color]);
  return data;
};

const QrPanel: React.FC<{ src: string; accent: string; widthPct: number | string; tone?: 'light' | 'dark' }> = ({
  src,
  accent,
  widthPct,
  tone = 'light',
}) => (
  <div
    style={{
      width: typeof widthPct === 'number' ? `${widthPct}%` : widthPct,
      aspectRatio: '1 / 1',
      background: '#ffffff',
      padding: '4%',
      borderRadius: 10,
      border: tone === 'light' ? `1.5px solid ${withAlpha(accent, 0.12)}` : '1.5px solid rgba(255,255,255,0.25)',
      boxShadow: tone === 'dark' ? '0 4px 16px rgba(0,0,0,0.18)' : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {src ? (
      <img src={src} alt="QR code" style={{ width: '100%', height: '100%', display: 'block' }} />
    ) : (
      <div style={{ fontSize: 10, color: '#999' }}>QR…</div>
    )}
  </div>
);

/**
 * Renders the blurb HTML produced by BlurbEditor (Tiptap). Plain text from
 * older saved cards is also valid HTML, so it renders fine.
 *
 * The class `handout-blurb` lets us scope list / paragraph styling without
 * fighting Tailwind preflight elsewhere.
 */
const Blurb: React.FC<{
  html: string;
  color: string;
  fontSize?: number;
  align?: 'left' | 'center';
  maxWidth?: string;
  marginBottom?: number;
  fontFamily?: string;
}> = ({ html, color, fontSize = 12, align = 'left', maxWidth, marginBottom = 0, fontFamily }) => {
  if (!html || html === '<p></p>') return null;
  return (
    <div
      className="handout-blurb"
      style={{
        fontSize,
        lineHeight: 1.5,
        color,
        maxWidth,
        fontFamily,
        marginInline: align === 'center' ? 'auto' : undefined,
        textAlign: align,
        margin: align === 'center' && maxWidth ? `0 auto ${marginBottom}px` : `0 0 ${marginBottom}px`,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const BLURB_STYLES = `
.handout-blurb p { margin: 0 0 6px; }
.handout-blurb p:last-child { margin-bottom: 0; }
.handout-blurb ul {
  padding-left: 18px;
  list-style: disc outside;
  margin: 0 0 6px;
}
.handout-blurb ul:last-child { margin-bottom: 0; }
.handout-blurb li { margin-bottom: 3px; }
.handout-blurb li > p { margin: 0; }
.handout-blurb strong { font-weight: 700; }
.handout-blurb em { font-style: italic; }
`;

const Cta: React.FC<{ label: string; accent: string; onDark?: boolean }> = ({ label, accent, onDark }) => {
  if (!label) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        borderRadius: 999,
        background: onDark ? '#ffffff' : accent,
        color: onDark ? darken(accent, 0.1) : '#ffffff',
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.01em',
      }}
    >
      {label}
      <span style={{ opacity: 0.85 }}>→</span>
    </div>
  );
};

const LOGO_PX_BY_VARIANT: Record<'side' | 'corner' | 'hero-footer', { sm: number; md: number; lg: number }> = {
  // Side variant: avatar in the bottom row of the left column.
  side:        { sm: 24, md: 36, lg: 50 },
  // Corner variant: top-left avatar — most prominent of the three.
  corner:      { sm: 44, md: 60, lg: 84 },
  // Hero variant: centered above the headline.
  'hero-footer': { sm: 32, md: 48, lg: 72 },
};

export const HandoutCard: React.FC<CardTemplateProps> = ({ card, cardRef, dimensions }) => {
  const {
    headline,
    subheadline,
    blurb,
    ctaUrl,
    ctaLabel,
    handoutVariant,
    handoutTheme,
    handoutLogoSize,
    headlineColor,
    qrColor,
    accentColor,
    fullName,
    businessName,
    photo,
  } = card;
  const logoSize = handoutLogoSize || 'md';
  const accent = accentColor || '#2D3748';
  const ar = dimensions?.aspectRatio ?? '4 / 6';
  const isDarkTheme = handoutTheme === 'dark';

  const headlineFontStack = resolveFontStack(card.headlineFont);
  const subheadFontStack = resolveFontStack(card.subheadlineFont);
  const blurbFontStack = resolveFontStack(card.blurbFont);

  // Resolved colors. headlineColor / qrColor are user overrides; if blank,
  // fall back to theme-appropriate defaults.
  const resolvedHeadline = headlineColor || (isDarkTheme ? '#ffffff' : '#1a1a1a');
  const resolvedQrColor = qrColor || accent;
  const qr = useInlineQr(ctaUrl || DEFAULT_QR_TARGET, resolvedQrColor);

  // Body / sub / footer colors derive from the headline color so a brand
  // override flows through coherently.
  const subheadColor = isDarkTheme ? withAlpha(resolvedHeadline, 0.85) : darken(accent, 0.05);
  const blurbColor = isDarkTheme ? withAlpha(resolvedHeadline, 0.8) : '#4a4a4a';
  const footerColor = isDarkTheme ? withAlpha(resolvedHeadline, 0.6) : '#9a9a9a';
  const qrTone: 'light' | 'dark' = isDarkTheme ? 'dark' : 'light';
  const ctaOnDark = isDarkTheme;

  const darkBg = `linear-gradient(170deg, ${accent}, ${darken(accent, 0.25)})`;
  const wrapperStyle: React.CSSProperties = {
    width: '100%',
    aspectRatio: ar,
    boxShadow: `0 8px 32px -8px ${withAlpha(accent, 0.25)}, 0 0 0 1px ${withAlpha(accent, 0.06)}`,
    background: isDarkTheme ? darkBg : '#ffffff',
  };

  // Shared blurb stylesheet for whichever variant renders.
  const blurbStyleTag = <style>{BLURB_STYLES}</style>;

  if (handoutVariant === 'side') {
    const leftBg = isDarkTheme ? darkBg : '#ffffff';
    const rightBg = isDarkTheme
      ? `linear-gradient(180deg, ${darken(accent, 0.05)}, ${darken(accent, 0.3)})`
      : `linear-gradient(180deg, ${accent}, ${darken(accent, 0.2)})`;

    return (
      <div ref={cardRef} className="w-full overflow-hidden rounded-xl" style={wrapperStyle}>
        {blurbStyleTag}
        <div className="grid h-full" style={{ gridTemplateColumns: '1.75fr 1fr' }}>
          <div className="flex flex-col justify-between" style={{ padding: '20px 18px', background: leftBg }}>
            <div>
              {subheadline && (
                <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: subheadColor, fontFamily: subheadFontStack }}>
                  {subheadline}
                </div>
              )}
              {headline && (
                <h2 style={{ marginTop: 6, fontSize: 22, lineHeight: 1.05, fontWeight: 700, color: resolvedHeadline, letterSpacing: '-0.01em', fontFamily: headlineFontStack }}>
                  {headline}
                </h2>
              )}
            </div>
            <div>
              <Blurb html={blurb} color={blurbColor} fontSize={11} align="left" marginBottom={12} fontFamily={blurbFontStack} />
              <Cta label={ctaLabel} accent={accent} onDark={ctaOnDark} />
            </div>
            {(photo || fullName || businessName) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: footerColor }}>
                {photo && (
                  <img
                    src={photo}
                    alt=""
                    style={{
                      width: LOGO_PX_BY_VARIANT.side[logoSize],
                      height: LOGO_PX_BY_VARIANT.side[logoSize],
                      borderRadius: 5,
                      objectFit: 'cover',
                    }}
                  />
                )}
                {(fullName || businessName) && (
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {[fullName, businessName].filter(Boolean).join(' · ')}
                  </span>
                )}
              </div>
            )}
          </div>
          <div
            className="flex flex-col items-center justify-center"
            style={{ background: rightBg, color: '#fff', padding: '20px 12px' }}
          >
            <QrPanel src={qr} accent={accent} widthPct={88} tone="dark" />
            <div style={{ marginTop: 12, fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.9 }}>
              Scan
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (handoutVariant === 'corner') {
    return (
      <div ref={cardRef} className="w-full overflow-hidden rounded-xl" style={wrapperStyle}>
        {blurbStyleTag}
        <div className="relative flex flex-col h-full" style={{ padding: '20px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            {photo ? (
              <img
                src={photo}
                alt=""
                style={{
                  width: LOGO_PX_BY_VARIANT.corner[logoSize],
                  height: LOGO_PX_BY_VARIANT.corner[logoSize],
                  borderRadius: 10,
                  objectFit: 'cover',
                  border: `1px solid ${isDarkTheme ? 'rgba(255,255,255,0.25)' : withAlpha(accent, 0.15)}`,
                }}
              />
            ) : (
              <div
                style={{
                  width: LOGO_PX_BY_VARIANT.corner[logoSize],
                  height: LOGO_PX_BY_VARIANT.corner[logoSize],
                  borderRadius: 10,
                  background: isDarkTheme ? 'rgba(255,255,255,0.12)' : withAlpha(accent, 0.1),
                }}
              />
            )}
            <div style={{ textAlign: 'right' }}>
              {subheadline && (
                <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: subheadColor, fontFamily: subheadFontStack }}>
                  {subheadline}
                </div>
              )}
              {fullName && (
                <div style={{ marginTop: 2, fontSize: 11, fontWeight: 500, color: blurbColor }}>{fullName}</div>
              )}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center text-center" style={{ padding: '12px 4px' }}>
            <div>
              {headline && (
                <h2 style={{ fontSize: 26, lineHeight: 1.05, fontWeight: 700, color: resolvedHeadline, letterSpacing: '-0.01em', margin: 0, fontFamily: headlineFontStack }}>
                  {headline}
                </h2>
              )}
              <div style={{ marginTop: 12 }}>
                <Blurb html={blurb} color={blurbColor} fontSize={12} align="center" maxWidth="92%" fontFamily={blurbFontStack} />
              </div>
              <div style={{ marginTop: 14 }}>
                <Cta label={ctaLabel} accent={accent} onDark={ctaOnDark} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
            {businessName ? (
              <span style={{ fontSize: 10, color: footerColor, alignSelf: 'flex-end', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {businessName}
              </span>
            ) : <span />}
            <QrPanel src={qr} accent={accent} widthPct="32%" tone={qrTone} />
          </div>
        </div>
      </div>
    );
  }

  // Hero
  return (
    <div ref={cardRef} className="w-full overflow-hidden rounded-xl" style={wrapperStyle}>
      {blurbStyleTag}
      <div className="relative flex flex-col h-full" style={{ padding: '24px 20px' }}>
        <div style={{ textAlign: 'center' }}>
          {photo && (
            <img
              src={photo}
              alt=""
              style={{
                width: LOGO_PX_BY_VARIANT['hero-footer'][logoSize],
                height: LOGO_PX_BY_VARIANT['hero-footer'][logoSize],
                borderRadius: 10,
                objectFit: 'cover',
                margin: '0 auto 10px',
                border: `1px solid ${isDarkTheme ? 'rgba(255,255,255,0.25)' : withAlpha(accent, 0.15)}`,
              }}
            />
          )}
          {subheadline && (
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: subheadColor, fontFamily: subheadFontStack }}>
              {subheadline}
            </div>
          )}
          {headline && (
            <h2 style={{ marginTop: 4, fontSize: 28, lineHeight: 1.05, fontWeight: 700, color: resolvedHeadline, letterSpacing: '-0.01em', fontFamily: headlineFontStack }}>
              {headline}
            </h2>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center" style={{ padding: '12px 0' }}>
          <QrPanel src={qr} accent={accent} widthPct={62} tone={qrTone} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Blurb html={blurb} color={blurbColor} fontSize={12} align="center" maxWidth="85%" marginBottom={12} fontFamily={blurbFontStack} />
          <Cta label={ctaLabel} accent={accent} onDark={ctaOnDark} />
          {(fullName || businessName) && (
            <div style={{ marginTop: 14, fontSize: 10, color: footerColor }}>
              {[fullName, businessName].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
