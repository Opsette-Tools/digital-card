import React from 'react';
import { Select, Switch, Tooltip, theme as antdTheme } from 'antd';
import { CardData, CardStyle } from '@/types/card';

interface StyleBarProps {
  card: CardData;
  onChange: (card: CardData) => void;
}

const STYLE_GROUPS: { group: string; hint: string; items: { value: CardStyle; label: string }[] }[] = [
  {
    group: 'Business Card',
    hint: 'for image export',
    items: [
      { value: 'modern', label: 'Monogram' },
      { value: 'clean', label: 'Wordmark' },
      { value: 'bold', label: 'Full Bleed' },
      { value: 'minimal', label: 'Editorial' },
      { value: 'neon', label: 'Dark Mode' },
    ],
  },
  {
    group: 'Contact Card',
    hint: 'for sharing links',
    items: [
      { value: 'profile', label: 'Profile' },
      { value: 'split', label: 'Split' },
      { value: 'stacked', label: 'Stacked' },
    ],
  },
];

const COLORS = [
  '#2D3748', '#4A6741', '#8B6F47', '#6B5B73', '#2E5266',
  '#9B4D4D', '#5C6B5C', '#7A6855', '#3D5A80', '#704C38',
];

const StyleBar: React.FC<StyleBarProps> = ({ card, onChange }) => {
  const { token } = antdTheme.useToken();
  const set = (key: keyof CardData, value: string | boolean) => onChange({ ...card, [key]: value });

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
        onChange={(v) => set('cardStyle', v)}
        options={options}
        style={{ width: '100%' }}
        size="large"
      />

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Switch
            size="small"
            checked={card.showInitials}
            onChange={(checked) => set('showInitials', checked)}
            style={card.showInitials ? { backgroundColor: card.accentColor } : undefined}
          />
          <span style={{ fontSize: 11, color: token.colorTextSecondary, userSelect: 'none' }}>AB</span>
        </div>
      </div>
    </div>
  );
};

export default StyleBar;
