import React from 'react';
import { CardData } from '@/types/card';
import { Button } from '@/components/ui/button';
import { getShareableUrl } from '@/lib/share';
import { downloadVCard } from '@/lib/vcard';
import { toPng } from 'html-to-image';
import { Link, Download, UserPlus, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ActionBarProps {
  card: CardData;
  cardRef: React.RefObject<HTMLDivElement>;
  onSave: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ card, cardRef, onSave }) => {
  const copyLink = async () => {
    if (!card.fullName) {
      toast.error('Please enter a name first');
      return;
    }
    const url = getShareableUrl(card);
    await navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${card.fullName || 'card'}.png`;
      a.click();
      toast.success('Image downloaded!');
    } catch {
      toast.error('Failed to download image');
    }
  };

  const handleVCard = () => {
    if (!card.fullName) {
      toast.error('Please enter a name first');
      return;
    }
    downloadVCard(card);
    toast.success('vCard downloaded!');
  };

  const handleSave = () => {
    if (!card.fullName) {
      toast.error('Please enter a name first');
      return;
    }
    onSave();
    toast.success('Card saved!');
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline" className="min-h-[44px]" onClick={copyLink}>
        <Link size={16} className="mr-2" /> Copy Link
      </Button>
      <Button variant="outline" className="min-h-[44px]" onClick={downloadImage}>
        <Download size={16} className="mr-2" /> Image
      </Button>
      <Button variant="outline" className="min-h-[44px]" onClick={handleVCard}>
        <UserPlus size={16} className="mr-2" /> vCard
      </Button>
      <Button className="min-h-[44px]" onClick={handleSave}>
        <Save size={16} className="mr-2" /> Save
      </Button>
    </div>
  );
};

export default ActionBar;
