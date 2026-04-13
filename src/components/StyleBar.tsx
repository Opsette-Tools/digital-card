import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CardData, CardStyle } from '@/types/card';

interface StyleBarProps {
  card: CardData;
  onChange: (card: CardData) => void;
}

const STYLES: { value: CardStyle; label: string }[] = [
  { value: 'modern', label: 'Monogram' },
  { value: 'clean', label: 'Wordmark' },
  { value: 'bold', label: 'Full Bleed' },
  { value: 'minimal', label: 'Editorial' },
  { value: 'neon', label: 'Dark Mode' },
];

// Muted, professional business card colors
const COLORS = [
  '#2D3748', // charcoal
  '#4A6741', // sage
  '#8B6F47', // warm brown
  '#6B5B73', // dusty mauve
  '#2E5266', // deep teal
  '#9B4D4D', // muted burgundy
  '#5C6B5C', // olive
  '#7A6855', // tan
  '#3D5A80', // steel blue
  '#704C38', // coffee
];

const StyleBar: React.FC<StyleBarProps> = ({ card, onChange }) => {
  const [styleOpen, setStyleOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const currentStyle = STYLES.find(s => s.value === card.cardStyle);

  const set = (key: keyof CardData, value: string | boolean) => onChange({ ...card, [key]: value });

  useEffect(() => {
    if (styleOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  }, [styleOpen]);

  return (
    <div className="bg-card rounded-xl p-3 shadow-sm border border-border/60 space-y-3">
      {/* Style dropdown */}
      <div>
        <button
          ref={buttonRef}
          onClick={() => setStyleOpen(!styleOpen)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-border hover:border-foreground/20 transition-colors text-sm bg-background"
        >
          <span className="font-medium text-foreground">{currentStyle?.label || 'Select style'}</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={`text-muted-foreground transition-transform ${styleOpen ? 'rotate-180' : ''}`}>
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {styleOpen && createPortal(
          <>
            <div className="fixed inset-0 z-[9998]" onClick={() => setStyleOpen(false)} />
            <div
              className="fixed z-[9999] bg-card rounded-lg border border-border shadow-lg overflow-hidden"
              style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
            >
              {STYLES.map(style => (
                <button
                  key={style.value}
                  onClick={() => { set('cardStyle', style.value); setStyleOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${card.cardStyle === style.value ? 'bg-foreground text-background font-medium' : 'hover:bg-accent text-foreground'}`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </>,
          document.body
        )}
      </div>

      {/* Color swatches + initials toggle row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap flex-1">
          {COLORS.map(c => (
            <button
              key={c}
              className="w-6 h-6 rounded-full border-2 transition-all"
              style={{
                backgroundColor: c,
                borderColor: card.accentColor === c ? 'hsl(var(--foreground))' : 'transparent',
                transform: card.accentColor === c ? 'scale(1.15)' : 'scale(1)',
              }}
              onClick={() => set('accentColor', c)}
              aria-label={`Color ${c}`}
            />
          ))}
          <input
            type="color"
            value={card.accentColor}
            onChange={e => set('accentColor', e.target.value)}
            className="w-6 h-6 rounded-full cursor-pointer border-0 p-0"
            title="Custom color"
          />
        </div>

        {/* Initials toggle */}
        <button
          role="switch"
          aria-checked={card.showInitials}
          aria-label="Show initials"
          onClick={() => set('showInitials', !card.showInitials)}
          className="relative w-8 h-[18px] rounded-full transition-colors shrink-0"
          style={{ backgroundColor: card.showInitials ? card.accentColor : 'hsl(var(--border))' }}
        >
          <div
            className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform"
            style={{ transform: card.showInitials ? 'translateX(15px)' : 'translateX(2px)' }}
          />
        </button>
        <span className="text-[11px] text-muted-foreground shrink-0 select-none">AB</span>
      </div>
    </div>
  );
};

export default StyleBar;
