import React from 'react';
import { CardData, isHandoutStyle } from '@/types/card';
import { ProfileCard, SplitCard, StackedCard, TypeCard, PhotoCard } from './cards/VCardTemplates';
import { HandoutCard } from './cards/HandoutCard';
import type { Dimensions } from '@/lib/print';

// Print-quality capture surface. In practice only the handout uses it now (the
// print-export menu item is handout-only after business cards were cut, §1a);
// the contact templates are kept in the map as a harmless fallback.
const templates: Record<string, React.FC<{ card: CardData; cardRef?: React.RefObject<HTMLDivElement>; dimensions?: Dimensions }>> = {
  profile: ProfileCard,
  split: SplitCard,
  stacked: StackedCard,
  type: TypeCard,
  photo: PhotoCard,
  handout: HandoutCard,
};

interface PrintCardProps {
  card: CardData;
  dimensions: Dimensions;
  outerRef?: React.RefObject<HTMLDivElement>;
}

const PrintCard: React.FC<PrintCardProps> = ({ card, dimensions, outerRef }) => {
  const Template = templates[card.cardStyle] || HandoutCard;
  const passDims = isHandoutStyle(card.cardStyle);
  return (
    <div
      ref={outerRef}
      style={{
        width: `${dimensions.trimWIn}in`,
        height: `${dimensions.trimHIn}in`,
        background: 'transparent',
      }}
    >
      <Template card={card} dimensions={passDims ? dimensions : undefined} />
    </div>
  );
};

export default PrintCard;
