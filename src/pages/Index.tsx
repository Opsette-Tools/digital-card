import React, { useState, useEffect, useRef } from 'react';
import { CardData, emptyCard } from '@/types/card';
import { getCardFromUrl } from '@/lib/share';
import CardForm from '@/components/CardForm';
import CardPreview from '@/components/CardPreview';
import ActionBar from '@/components/ActionBar';
import SharedCardView from '@/components/SharedCardView';

const STORAGE_KEY = 'business-card-data';

const Index: React.FC = () => {
  const [sharedCard, setSharedCard] = useState<CardData | null>(null);
  const [card, setCard] = useState<CardData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { ...emptyCard };
    } catch {
      return { ...emptyCard };
    }
  });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkHash = () => {
      const fromUrl = getCardFromUrl();
      setSharedCard(fromUrl);
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(card));
  };

  if (sharedCard) {
    return <SharedCardView card={sharedCard} />;
  }

  return (
    <div className="min-h-screen p-4 pb-8" style={{ background: 'linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--background)) 100%)' }}>
      <div className="w-full max-w-[480px] mx-auto space-y-6">
        <header className="text-center pt-4">
          <h1 className="text-2xl font-bold text-foreground">Business Card Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">Create your digital business card</p>
        </header>

        <div className="flex justify-center">
          <CardPreview card={card} cardRef={cardRef} />
        </div>

        <ActionBar card={card} cardRef={cardRef} onSave={handleSave} />

        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <CardForm card={card} onChange={setCard} />
        </div>
      </div>
    </div>
  );
};

export default Index;
