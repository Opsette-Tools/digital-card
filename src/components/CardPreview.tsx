import React from 'react';
import { CardData, isHandoutStyle } from '@/types/card';
import { ProfileCard, SplitCard, StackedCard, TypeCard, PhotoCard } from './cards/VCardTemplates';
import { HandoutCard } from './cards/HandoutCard';
import { getDimensions, type Dimensions } from '@/lib/print';

interface CardPreviewProps {
  card: CardData;
  cardRef?: React.RefObject<HTMLDivElement>;
  /** Override the on-screen size cap. Contact cards default to 400 (their own
   * max-width); handouts default to 540 (the longer side). Pass a larger value
   * on desktop to use the extra horizontal room. */
  sizeCap?: number;
}

const templates: Record<string, React.FC<{ card: CardData; cardRef?: React.RefObject<HTMLDivElement>; dimensions?: Dimensions }>> = {
  profile: ProfileCard,
  split: SplitCard,
  stacked: StackedCard,
  type: TypeCard,
  photo: PhotoCard,
  handout: HandoutCard,
};

const CardPreview: React.FC<CardPreviewProps> = ({ card, cardRef, sizeCap }) => {
  const Template = templates[card.cardStyle] || ProfileCard;
  const dims = getDimensions(card.cardSize);
  const isHandout = isHandoutStyle(card.cardStyle);

  // Handouts anchor by the longer dimension so different print sizes stay
  // proportional on screen (5×7 visibly larger than 4×6). Contact cards are
  // dimensionless — they cap their own width (400) — and anchor by width.
  const handoutTargetLongPx = sizeCap ?? 540;
  const contactWidthCap = sizeCap ?? 400;
  const handoutWidthCap = isHandout
    ? Math.round(handoutTargetLongPx * (dims.trimWIn / Math.max(dims.trimWIn, dims.trimHIn)))
    : contactWidthCap;
  const widthCap = isHandout ? handoutWidthCap : contactWidthCap;

  return (
    <div style={{ maxWidth: widthCap, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ position: 'relative', width: '100%' }}>
        <Template card={card} cardRef={cardRef} dimensions={isHandout ? dims : undefined} />
      </div>
    </div>
  );
};

export default CardPreview;
