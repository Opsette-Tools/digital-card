import React from 'react';
import { CardData } from '@/types/card';
import CardPreview from './CardPreview';
import { Button } from '@/components/ui/button';
import { downloadVCard } from '@/lib/vcard';
import { Link, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface SharedCardViewProps {
  card: CardData;
}

const SharedCardView: React.FC<SharedCardViewProps> = ({ card }) => {
  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--background)) 100%)' }}>
      <div className="w-full max-w-[480px] flex flex-col items-center gap-6">
        <CardPreview card={card} />
        <div className="flex gap-3 w-full">
          <Button className="flex-1 min-h-[44px]" onClick={() => { downloadVCard(card); toast.success('Contact saved!'); }}>
            <UserPlus size={16} className="mr-2" /> Save Contact
          </Button>
          <Button variant="outline" className="flex-1 min-h-[44px]" onClick={copyLink}>
            <Link size={16} className="mr-2" /> Copy Link
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SharedCardView;
