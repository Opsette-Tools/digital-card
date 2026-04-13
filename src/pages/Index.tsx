import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const dataParam = searchParams.get('data');
  const sharedCard = dataParam ? decodeCardFromHash(dataParam) : null;

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

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* App header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-[480px] mx-auto flex items-center gap-2.5 px-4 py-3">
          <AppLogo size={28} />
          <h1 className="text-lg font-bold tracking-tight text-foreground">CardCraft</h1>
        </div>
      </header>

      <main className="max-w-[480px] mx-auto px-4 py-4 space-y-4 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="animate-fade-in-up">
          <StyleBar card={card} onChange={setCard} />
        </div>

        <div className="animate-scale-in" style={{ animationDelay: '0.05s' }}>
          <CardPreview card={card} cardRef={cardRef} />
        </div>

        <div className="bg-card rounded-xl p-3 border border-border/60 animate-fade-in-up" style={{ animationDelay: '0.1s', boxShadow: '0 2px 6px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)' }}>
          <ActionBar card={card} cardRef={cardRef} onSave={handleSave} />
        </div>

        <div className="bg-card rounded-xl p-4 border border-border/60 animate-fade-in-up" style={{ animationDelay: '0.15s', boxShadow: '0 2px 6px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)' }}>
          <CardForm card={card} onChange={setCard} />
        </div>
      </main>
    </div>
  );
};

export default Index;
