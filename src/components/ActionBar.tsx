import React, { useState } from 'react';
import { CardData } from '@/types/card';
import { getShareableUrl } from '@/lib/share';
import { downloadVCard } from '@/lib/vcard';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';
import QrModal from './QrModal';

interface ActionBarProps {
  card: CardData;
  cardRef: React.RefObject<HTMLDivElement>;
  onSave: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ card, cardRef, onSave }) => {
  const [qrOpen, setQrOpen] = useState(false);

  const copyLink = async () => {
    if (!card.fullName) { toast.error('Enter a name first'); return; }
    const url = getShareableUrl(card);
    await navigator.clipboard.writeText(url);
    toast.success('Link copied');
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${card.fullName || 'card'}.png`;
      a.click();
      toast.success('Image saved');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleVCard = () => {
    if (!card.fullName) { toast.error('Enter a name first'); return; }
    downloadVCard(card);
    toast.success('Contact downloaded');
  };

  const handleSave = () => {
    if (!card.fullName) { toast.error('Enter a name first'); return; }
    onSave();
    toast.success('Saved');
  };

  const handleQr = () => {
    if (!card.fullName) { toast.error('Enter a name first'); return; }
    setQrOpen(true);
  };

  const btn = "flex items-center justify-center gap-1.5 text-xs font-medium h-10 rounded-lg border border-border hover:bg-accent active:scale-[0.98] transition-all text-foreground";
  const btnPrimary = "flex items-center justify-center gap-1.5 text-xs font-medium h-10 rounded-lg bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98] transition-all";

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <button className={btn} onClick={copyLink}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6.5 9.5l3-3M9 6a2.5 2.5 0 013.5 3.5l-2 2A2.5 2.5 0 017 8M7 10a2.5 2.5 0 01-3.5-3.5l2-2A2.5 2.5 0 019 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          Link
        </button>
        <button className={btn} onClick={downloadImage}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2v8.5m0 0L5 7.5m3 3L11 7.5M3 12.5h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Image
        </button>
        <button className={btn} onClick={handleQr}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="2" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/><rect x="2" y="9" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/><rect x="10" y="10" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2"/></svg>
          QR
        </button>
        <button className={btn} onClick={handleVCard}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 2h3v12H3V2h3M6 2a2 2 0 114 0M6 8h4M6 10.5h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          vCard
        </button>
        <button className={`${btnPrimary} col-span-2`} onClick={handleSave}>
          Save Card
        </button>
      </div>
      <QrModal card={card} open={qrOpen} onClose={() => setQrOpen(false)} />
    </>
  );
};

export default ActionBar;
