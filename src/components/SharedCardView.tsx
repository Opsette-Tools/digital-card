import React, { useState } from 'react';
import { CardData } from '@/types/card';
import CardPreview from './CardPreview';
import QrModal from './QrModal';
import { downloadVCard } from '@/lib/vcard';
import { toast } from 'sonner';

interface SharedCardViewProps {
  card: CardData;
}

const SharedCardView: React.FC<SharedCardViewProps> = ({ card }) => {
  const [qrOpen, setQrOpen] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied');
  };

  const btn = "flex items-center justify-center gap-1.5 text-xs font-medium h-10 rounded-lg border border-border hover:bg-accent active:scale-[0.98] transition-all text-foreground";

  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[480px] flex flex-col items-center gap-4">
        <div className="animate-scale-in">
          <CardPreview card={card} />
        </div>
        <div className="flex gap-2 w-full animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <button className={`${btn} flex-1`} onClick={() => { downloadVCard(card); toast.success('Contact saved'); }}>
            Save Contact
          </button>
          <button className={btn} onClick={() => setQrOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="2" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/><rect x="2" y="9" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/><rect x="10" y="10" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2"/></svg>
          </button>
          <button className={`${btn} flex-1`} onClick={copyLink}>
            Copy Link
          </button>
        </div>
      </div>
      <QrModal card={card} open={qrOpen} onClose={() => setQrOpen(false)} />
    </div>
  );
};

export default SharedCardView;
