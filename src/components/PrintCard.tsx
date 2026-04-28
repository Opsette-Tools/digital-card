import React from 'react';
import { CardData, isBusinessStyle } from '@/types/card';
import { MonogramCard, WordmarkCard, FullBleedCard, EditorialCard, DarkCard } from './cards/BusinessCards';
import { ProfileCard, SplitCard, StackedCard } from './cards/VCardTemplates';
import type { Dimensions } from '@/lib/print';

const templates: Record<string, React.FC<{ card: CardData; cardRef?: React.RefObject<HTMLDivElement>; dimensions?: Dimensions }>> = {
  modern: MonogramCard,
  clean: WordmarkCard,
  bold: FullBleedCard,
  minimal: EditorialCard,
  neon: DarkCard,
  profile: ProfileCard,
  split: SplitCard,
  stacked: StackedCard,
};

interface PrintCardProps {
  card: CardData;
  dimensions: Dimensions;
  outerRef?: React.RefObject<HTMLDivElement>;
}

const PrintCard: React.FC<PrintCardProps> = ({ card, dimensions, outerRef }) => {
  const Template = templates[card.cardStyle] || MonogramCard;
  const isBusiness = isBusinessStyle(card.cardStyle);
  return (
    <div
      ref={outerRef}
      style={{
        width: `${dimensions.trimWIn}in`,
        height: `${dimensions.trimHIn}in`,
        background: 'transparent',
      }}
    >
      <Template card={card} dimensions={isBusiness ? dimensions : undefined} />
    </div>
  );
};

export default PrintCard;
