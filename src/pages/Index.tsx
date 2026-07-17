import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Space, Grid, theme as antdTheme, App as AntApp } from 'antd';
import { CardData, emptyCard } from '@/types/card';
import { decodeCardFromHash } from '@/lib/share';
import {
  readSeedFromUrl,
  clearLinkParams,
  isEmbedded,
  isTrustedEmbedMessage,
  embedSave,
  OPSETTE_TOOLS_ORIGIN,
} from '@/lib/opsette-kit-link';
import { initialCardFromSeed } from '@/lib/seed';
import { fromKitJson, toKitJson } from '@/lib/brandKit';
import { renderWebImage } from '@/lib/export';
import { OpsetteHeader } from '@/components/opsette-header';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { EmbedSaveBar } from '@/components/EmbedSaveBar';
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
  const screens = Grid.useBreakpoint();
  const isDesktop = !!screens.md;

  const [card, setCard] = useState<CardData>(() => {
    // A ?seed= brand core (Mechanism 1) wins over the last-saved card: arriving
    // from the "New client kit" starter should open on THIS client's name +
    // accent, not whatever card was built last. No seed → restore localStorage,
    // exactly as before.
    const core = readSeedFromUrl();
    if (core) {
      const seeded = initialCardFromSeed(core);
      // Only take the seed path when it actually filled something.
      if (JSON.stringify(seeded) !== JSON.stringify(emptyCard)) return seeded;
    }
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
  const { message } = AntApp.useApp();

  // ── Mechanism 3: running inside a Brand Board iframe ──────────────────────
  // Capture embed mode BEFORE clearLinkParams strips ?embed= from the URL. When
  // embedded we hide chrome, listen for the parent's card blob, and offer a
  // "Save to Brand Board" bar that posts the revised card back up.
  const embedded = useMemo(() => isEmbedded(), []);
  const trustedParentOrigins = useMemo(
    () => (import.meta.env.DEV ? [window.location.origin, 'http://localhost:8124'] : []),
    [],
  );
  const [saving, setSaving] = useState(false);

  // Strip the seed param from the address bar once consumed, so a refresh
  // doesn't re-seed over edits. (The ?data= share param is left to its own
  // flow.)
  useEffect(() => {
    clearLinkParams();
  }, []);

  const handleSave = () => {
    // Don't persist to this device while embedded — editing a client's card in
    // the Brand Board drawer must not overwrite the user's own last-saved card.
    if (embedded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(card));
  };

  const handleReopen = (reopened: CardData) => {
    setCard(reopened);
  };

  // Inbound: the parent hands us the current card blob to revise (or null =
  // fresh). Reuse the exact reopen parser the paste modal uses. Origin-checked.
  useEffect(() => {
    if (!embedded) return;
    const onMessage = (event: MessageEvent) => {
      if (!isTrustedEmbedMessage(event, trustedParentOrigins)) return;
      if (event.data.kind === 'load' && typeof event.data.payload === 'string') {
        const reopened = fromKitJson(event.data.payload);
        if (reopened) setCard(reopened);
      }
    };
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ source: 'opsette-embed', kind: 'ready' }, '*');
    return () => window.removeEventListener('message', onMessage);
  }, [embedded, trustedParentOrigins]);

  // Outbound: bake the same PNG + .vcf blob "Export to Brand Board" produces and
  // post it back up. Targeted at the apex in prod, the dev parent locally.
  const saveToBrandBoard = async () => {
    setSaving(true);
    try {
      let image: string | undefined;
      if (cardRef.current) {
        try {
          image = await renderWebImage(cardRef.current);
        } catch {
          image = undefined;
        }
      }
      const payload = await toKitJson(card, image);
      const targetOrigin = import.meta.env.DEV ? '*' : OPSETTE_TOOLS_ORIGIN;
      window.parent.postMessage(embedSave(JSON.stringify(payload)), targetOrigin);
      message.success('Updated in Brand Board');
    } catch {
      message.error("Couldn't send the card back — try again.");
    } finally {
      setSaving(false);
    }
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

  const footer = embedded ? null : (
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
  );

  return (
    <div style={{ minHeight: '100dvh', background: token.colorBgLayout }}>
      {embedded ? (
        <EmbedSaveBar label="your card" onSave={() => void saveToBrandBoard()} saving={saving} />
      ) : (
        <OpsetteHeader rightExtra={<ThemeToggleButton />} />
      )}

      {isDesktop ? (
        <main
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '24px 24px max(2rem, env(safe-area-inset-bottom))',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 6fr) minmax(0, 5fr)',
            gap: 32,
            alignItems: 'start',
          }}
        >
          {/* Left column: controls + form scroll naturally */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="animate-fade-in-up">
              <StyleBar card={card} onChange={setCard} />
            </div>

            <div className="animate-fade-in-up" style={{ ...surface, padding: 16, animationDelay: '0.15s' }}>
              <CardForm card={card} onChange={setCard} />
            </div>

            {footer}
          </div>

          {/* Right column: preview pinned, scrolls with the page until it hits the top */}
          <div
            style={{
              position: 'sticky',
              top: 76, // canonical header height (60) + small breathing room
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div className="animate-scale-in">
              <CardPreview card={card} cardRef={cardRef} showGuides={card.showPrintGuides} sizeCap={640} />
            </div>

            <div className="animate-fade-in-up" style={{ ...surface, padding: 12, animationDelay: '0.1s' }}>
              <ActionBar card={card} cardRef={cardRef} onSave={handleSave} onReopen={handleReopen} />
            </div>
          </div>
        </main>
      ) : (
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
            <ActionBar card={card} cardRef={cardRef} onSave={handleSave} onReopen={handleReopen} />
          </div>

          <div className="animate-fade-in-up" style={{ ...surface, padding: 16, animationDelay: '0.15s' }}>
            <CardForm card={card} onChange={setCard} />
          </div>

          {footer}
        </main>
      )}
    </div>
  );
};

export default Index;
