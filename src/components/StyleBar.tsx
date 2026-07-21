import React from 'react';
import { Segmented, Select, Switch, Tooltip, theme as antdTheme } from 'antd';
import {
  CardData,
  CardStyle,
  CardSize,
  HandoutVariant,
  HandoutTheme,
  HandoutLogoSize,
  isHandoutStyle,
} from '@/types/card';
import { HANDOUT_SIZE_OPTIONS } from '@/lib/print';
import { FONT_OPTIONS } from '@/lib/handout-fonts';
import { OpsetteFontPicker } from '@/components/opsette-font-picker';

interface StyleBarProps {
  card: CardData;
  onChange: (card: CardData) => void;
}

// Business-card templates were cut in the shrink-to-real pass (§1a). What's left
// is the contact cards (the real visual output) + the handout (spun off later).
const STYLE_GROUPS: { group: string; hint: string; items: { value: CardStyle; label: string }[] }[] = [
  {
    group: 'Contact Card',
    hint: 'share or paste anywhere',
    items: [
      { value: 'profile', label: 'Profile' },
      { value: 'split', label: 'Split' },
      { value: 'stacked', label: 'Stacked' },
      { value: 'type', label: 'Type' },
      { value: 'photo', label: 'Photo' },
    ],
  },
  {
    group: 'Marketing Handout',
    hint: 'QR + headline · printable',
    items: [
      { value: 'handout', label: 'Handout' },
    ],
  },
];

const COLORS = [
  '#2D3748', '#4A6741', '#8B6F47', '#6B5B73', '#2E5266',
  '#9B4D4D', '#5C6B5C', '#7A6855', '#3D5A80', '#704C38',
];

const HANDOUT_VARIANTS: { value: HandoutVariant; label: string }[] = [
  { value: 'hero',   label: 'QR Hero' },
  { value: 'side',   label: 'QR Side' },
  { value: 'corner', label: 'QR Corner' },
];

interface ColorOverrideProps {
  value: string;
  fallback: string;
  onChange: (v: string) => void;
  token: ReturnType<typeof antdTheme.useToken>['token'];
}

interface FontSelectProps {
  value: string;
  onChange: (v: string) => void;
}

// Legacy single-font <Select> — used ONLY by the handout's three font rows,
// which stay on the old private font list (the handout is untouched, §1c).
const FontSelect: React.FC<FontSelectProps> = ({ value, onChange }) => {
  const selected = FONT_OPTIONS.find(f => f.value === value) ?? FONT_OPTIONS[0];
  return (
    <Select
      size="small"
      value={value}
      onChange={onChange}
      style={{ width: 150 }}
      popupMatchSelectWidth={220}
      labelRender={() => (
        <span style={{ fontFamily: selected.stack || undefined }}>{selected.label}</span>
      )}
      options={FONT_OPTIONS.map(f => ({
        value: f.value,
        label: <span style={{ fontFamily: f.stack || undefined }}>{f.label}</span>,
      }))}
    />
  );
};

const ColorOverride: React.FC<ColorOverrideProps> = ({ value, fallback, onChange, token }) => {
  const isOverridden = !!value;
  const displayed = value || fallback;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Tooltip title={isOverridden ? `Custom: ${value}` : `Default: ${fallback}`} mouseEnterDelay={0.4}>
        <input
          type="color"
          value={displayed}
          onChange={e => onChange(e.target.value)}
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            cursor: 'pointer',
            border: isOverridden ? `2px solid ${token.colorText}` : '2px solid transparent',
            padding: 0,
            background: 'transparent',
          }}
          aria-label="Pick color"
        />
      </Tooltip>
      {isOverridden && (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{
            fontSize: 10,
            color: token.colorTextSecondary,
            background: 'transparent',
            border: 'none',
            padding: '0 4px',
            cursor: 'pointer',
          }}
          aria-label="Reset to default"
        >
          reset
        </button>
      )}
    </div>
  );
};

const StyleBar: React.FC<StyleBarProps> = ({ card, onChange }) => {
  const { token } = antdTheme.useToken();
  const set = <K extends keyof CardData>(key: K, value: CardData[K]) => onChange({ ...card, [key]: value });

  /** Switching style may need to coerce cardSize into the right tier. */
  const handleStyleChange = (next: CardStyle) => {
    let cardSize = card.cardSize;
    if (isHandoutStyle(next) && !cardSize.startsWith('handout-')) {
      cardSize = 'handout-4x6';
    } else if (!isHandoutStyle(next) && cardSize.startsWith('handout-')) {
      cardSize = 'square';
    }
    onChange({ ...card, cardStyle: next, cardSize });
  };

  const isHandout = isHandoutStyle(card.cardStyle);

  const options = STYLE_GROUPS.map(group => ({
    label: (
      <span>
        <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: token.colorTextSecondary }}>
          {group.group}
        </span>
        <span style={{ fontSize: 9, marginLeft: 6, color: token.colorTextTertiary }}>{group.hint}</span>
      </span>
    ),
    title: group.group,
    options: group.items.map(item => ({ value: item.value, label: item.label })),
  }));

  return (
    <div
      style={{
        background: token.colorBgContainer,
        borderRadius: 12,
        padding: 12,
        border: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: '0 2px 6px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <Select<CardStyle>
        value={card.cardStyle}
        onChange={handleStyleChange}
        options={options}
        style={{ width: '100%' }}
        size="large"
      />

      {isHandout && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Segmented<HandoutVariant>
            block
            size="middle"
            value={card.handoutVariant}
            onChange={(v) => set('handoutVariant', v as HandoutVariant)}
            options={HANDOUT_VARIANTS}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 11, color: token.colorTextSecondary, fontWeight: 500 }}>Card style</span>
            <Segmented<HandoutTheme>
              size="small"
              value={card.handoutTheme}
              onChange={(v) => set('handoutTheme', v as HandoutTheme)}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
            />
          </div>
          {card.photo && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 11, color: token.colorTextSecondary, fontWeight: 500 }}>Logo size</span>
              <Segmented<HandoutLogoSize>
                size="small"
                value={card.handoutLogoSize || 'md'}
                onChange={(v) => set('handoutLogoSize', v as HandoutLogoSize)}
                options={[
                  { value: 'sm', label: 'S' },
                  { value: 'md', label: 'M' },
                  { value: 'lg', label: 'L' },
                ]}
              />
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 11, color: token.colorTextSecondary, fontWeight: 500 }}>Headline color</span>
            <ColorOverride
              value={card.headlineColor}
              fallback={card.handoutTheme === 'dark' ? '#ffffff' : '#1a1a1a'}
              onChange={(v) => set('headlineColor', v)}
              token={token}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 11, color: token.colorTextSecondary, fontWeight: 500 }}>QR color</span>
            <ColorOverride
              value={card.qrColor}
              fallback={card.accentColor || '#2D3748'}
              onChange={(v) => set('qrColor', v)}
              token={token}
            />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', flex: 1 }}>
          {COLORS.map(c => (
            <Tooltip key={c} title={c} mouseEnterDelay={0.4}>
              <button
                type="button"
                aria-label={`Color ${c}`}
                onClick={() => set('accentColor', c)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: c,
                  border: card.accentColor === c ? `2px solid ${token.colorText}` : '2px solid transparent',
                  transform: card.accentColor === c ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
            </Tooltip>
          ))}
          <Tooltip title="Custom color" mouseEnterDelay={0.4}>
            <input
              type="color"
              value={card.accentColor}
              onChange={e => set('accentColor', e.target.value)}
              style={{ width: 24, height: 24, borderRadius: '50%', cursor: 'pointer', border: 0, padding: 0, background: 'transparent' }}
              title="Custom color"
            />
          </Tooltip>
        </div>
        {!isHandout && (
          <Tooltip title="Show an initials avatar when there's no photo" mouseEnterDelay={0.4}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Switch
                size="small"
                checked={card.showInitials}
                onChange={(checked) => set('showInitials', checked)}
                style={card.showInitials ? { backgroundColor: card.accentColor } : undefined}
              />
              <span style={{ fontSize: 11, color: token.colorTextSecondary, userSelect: 'none' }}>AB</span>
            </div>
          </Tooltip>
        )}
      </div>

      {isHandout && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            paddingTop: 10,
            borderTop: `1px dashed ${token.colorBorderSecondary}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: token.colorTextSecondary, fontWeight: 500 }}>Print size</span>
            <Segmented<CardSize>
              size="small"
              value={card.cardSize}
              onChange={(v) => set('cardSize', v as CardSize)}
              options={HANDOUT_SIZE_OPTIONS}
            />
          </div>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          paddingTop: 10,
          borderTop: `1px dashed ${token.colorBorderSecondary}`,
        }}
      >
        {isHandout ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 11, color: token.colorTextSecondary, fontWeight: 500 }}>Headline font</span>
              <FontSelect value={card.headlineFont} onChange={(v) => set('headlineFont', v)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 11, color: token.colorTextSecondary, fontWeight: 500 }}>Sub-headline font</span>
              <FontSelect value={card.subheadlineFont} onChange={(v) => set('subheadlineFont', v)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 11, color: token.colorTextSecondary, fontWeight: 500 }}>Blurb font</span>
              <FontSelect value={card.blurbFont} onChange={(v) => set('blurbFont', v)} />
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, color: token.colorTextSecondary, fontWeight: 500 }}>Fonts</span>
            <OpsetteFontPicker
              value={card.fontId}
              onChange={(id) => set('fontId', id)}
              size="middle"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleBar;
