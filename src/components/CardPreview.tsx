import React from 'react';
import { CardData, isBusinessStyle } from '@/types/card';
import { MonogramCard, WordmarkCard, FullBleedCard, EditorialCard, DarkCard } from './cards/BusinessCards';
import { ProfileCard, SplitCard, StackedCard } from './cards/VCardTemplates';
import { getDimensions, type Dimensions } from '@/lib/print';

interface CardPreviewProps {
  card: CardData;
  cardRef?: React.RefObject<HTMLDivElement>;
  showGuides?: boolean;
}

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

const PrintGuides: React.FC<{ dimensions: Dimensions }> = ({ dimensions }) => {
  const bleedPctW = (0.125 / dimensions.trimWIn) * 100;
  const bleedPctH = (0.125 / dimensions.trimHIn) * 100;
  const safePctW = (0.125 / dimensions.trimWIn) * 100;
  const safePctH = (0.125 / dimensions.trimHIn) * 100;

  return (
    <div className="no-print" aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
      <div
        style={{
          position: 'absolute',
          left: `${safePctW}%`,
          right: `${safePctW}%`,
          top: `${safePctH}%`,
          bottom: `${safePctH}%`,
          border: '1px dashed rgba(34, 197, 94, 0.7)',
          borderRadius: 6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: `-${bleedPctW}%`,
          right: `-${bleedPctW}%`,
          top: `-${bleedPctH}%`,
          bottom: `-${bleedPctH}%`,
          border: '1px dashed rgba(239, 68, 68, 0.55)',
          borderRadius: 8,
        }}
      />
    </div>
  );
};

const CardPreview: React.FC<CardPreviewProps> = ({ card, cardRef, showGuides }) => {
  const Template = templates[card.cardStyle] || MonogramCard;
  const dims = getDimensions(card.cardSize);
  const isBusiness = isBusinessStyle(card.cardStyle);
  const guidesActive = !!showGuides && isBusiness && dims.showGuides;

  // Reserve outer padding so the bleed dashed line (which extends past the
  // card on each side) doesn't collide with surrounding UI. 16 px is more
  // than enough at any preview width up to 400 px.
  const bleedPad = guidesActive ? 16 : 0;

  return (
    <div style={{ maxWidth: 400 + bleedPad * 2, margin: '0 auto', width: '100%', padding: bleedPad, boxSizing: 'border-box' }}>
      <div style={{ position: 'relative', width: '100%' }}>
        <Template card={card} cardRef={cardRef} dimensions={isBusiness ? dims : undefined} />
        {guidesActive && <PrintGuides dimensions={dims} />}
      </div>
    </div>
  );
};

export default CardPreview;
