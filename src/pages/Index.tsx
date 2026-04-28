import React, { useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Space, theme as antdTheme } from 'antd';
import { CardData, emptyCard } from '@/types/card';
import { decodeCardFromHash } from '@/lib/share';
import AppLogo from '@/components/AppLogo';
import StyleBar from '@/components/StyleBar';
import CardForm from '@/components/CardForm';
import CardPreview from '@/components/CardPreview';
import ActionBar from '@/components/ActionBar';
import SharedCardView from '@/components/SharedCardView';

const STORAGE_KEY = 'business-card-data';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dataParam = searchParams.get('data');
  const sharedCard = dataParam ? decodeCardFromHash(dataParam) : null;
  const { token } = antdTheme.useToken();

  const [card, setCard] = useState<CardData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...emptyCard, ...parsed };
      }
      return { ...emptyCard };
    } catch {
      return { ...emptyCard };
    }
  });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(card));
  };

  if (sharedCard) {
    return <SharedCardView card={sharedCard} />;
  }

  const surface: React.CSSProperties = {
    background: token.colorBgContainer,
    borderRadius: 12,
    border: `1px solid ${token.colorBorderSecondary}`,
    boxShadow: '0 2px 6px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)',
  };

  return (
    <div style={{ minHeight: '100dvh', background: token.colorBgLayout }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
          <AppLogo size={28} />
          <h1 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', color: token.colorText, margin: 0 }}>CardCraft</h1>
        </div>
      </header>

      <main
        style={{
          maxWidth: 480,
          margin: '0 auto',
          padding: '16px 16px max(2rem, env(safe-area-inset-bottom))',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div className="animate-fade-in-up">
          <StyleBar card={card} onChange={setCard} />
        </div>

        <div className="animate-scale-in" style={{ animationDelay: '0.05s' }}>
          <CardPreview card={card} cardRef={cardRef} showGuides={card.showPrintGuides} />
        </div>

        <div className="animate-fade-in-up" style={{ ...surface, padding: 12, animationDelay: '0.1s' }}>
          <ActionBar card={card} cardRef={cardRef} onSave={handleSave} />
        </div>

        <div className="animate-fade-in-up" style={{ ...surface, padding: 16, animationDelay: '0.15s' }}>
          <CardForm card={card} onChange={setCard} />
        </div>

        <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 0' }} className="animate-fade-in">
          <Space split={<span style={{ color: token.colorTextQuaternary }}>·</span>} size="small">
            <button
              onClick={() => navigate('/about')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: token.colorTextSecondary, padding: 0 }}
            >
              How to Use
            </button>
            <button
              onClick={() => navigate('/privacy')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: token.colorTextSecondary, padding: 0 }}
            >
              Privacy
            </button>
            <span style={{ fontSize: 12, color: token.colorTextSecondary }}>
              By{' '}
              <a
                href="https://opsette.io"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'underline' }}
              >
                Opsette
              </a>
            </span>
          </Space>
        </footer>
      </main>
    </div>
  );
};

export default Index;
