import React from 'react';
import { CardData } from '@/types/card';
import { Phone, Mail, Globe, Instagram, Facebook, MapPin } from 'lucide-react';

interface CardPreviewProps {
  card: CardData;
  cardRef?: React.RefObject<HTMLDivElement>;
}

const ContactIcon = ({ icon: Icon, value, href }: { icon: React.ElementType; value: string; href?: string }) => {
  if (!value) return null;
  const content = (
    <span className="flex items-center gap-2 text-sm min-h-[44px] py-1">
      <Icon size={16} className="shrink-0" />
      <span className="break-all">{value}</span>
    </span>
  );
  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">{content}</a>;
  }
  return <div>{content}</div>;
};

const CardPreview: React.FC<CardPreviewProps> = ({ card, cardRef }) => {
  const { fullName, title, businessName, phone, email, website, instagram, facebook, address, photo, accentColor, cardStyle } = card;

  const hasContact = phone || email || website || instagram || facebook || address;
  const displayName = businessName || fullName || 'Your Card';

  const igHandle = instagram?.replace('@', '');
  const igUrl = igHandle ? `https://instagram.com/${igHandle}` : undefined;

  const renderContacts = (textColor?: string) => (
    <div className="space-y-0.5" style={{ color: textColor }}>
      <ContactIcon icon={Phone} value={phone} href={phone ? `tel:${phone}` : undefined} />
      <ContactIcon icon={Mail} value={email} href={email ? `mailto:${email}` : undefined} />
      <ContactIcon icon={Globe} value={website?.replace(/^https?:\/\//, '')} href={website} />
      <ContactIcon icon={Instagram} value={instagram} href={igUrl} />
      <ContactIcon icon={Facebook} value={facebook ? 'Facebook' : ''} href={facebook} />
      <ContactIcon icon={MapPin} value={address} />
    </div>
  );

  if (cardStyle === 'modern') {
    return (
      <div ref={cardRef} className="rounded-2xl overflow-hidden shadow-xl transition-all duration-300 w-full" style={{ maxWidth: 400 }}>
        <div className="p-6 text-center" style={{ backgroundColor: accentColor }}>
          {photo && <img src={photo} alt={fullName} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-white/30" />}
          <h2 className="text-xl font-bold text-white">{displayName}</h2>
          {title && <p className="text-white/80 text-sm mt-1">{title}</p>}
          {businessName && fullName && businessName !== displayName && (
            <p className="text-white/70 text-xs mt-1">{fullName}</p>
          )}
        </div>
        {hasContact && (
          <div className="bg-white p-5">
            {renderContacts('#333')}
          </div>
        )}
      </div>
    );
  }

  if (cardStyle === 'clean') {
    return (
      <div ref={cardRef} className="rounded-2xl overflow-hidden shadow-xl bg-white transition-all duration-300 w-full" style={{ maxWidth: 400, borderTop: `4px solid ${accentColor}` }}>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            {photo && <img src={photo} alt={fullName} className="w-16 h-16 rounded-full object-cover" style={{ border: `2px solid ${accentColor}` }} />}
            <div>
              <h2 className="text-lg font-bold" style={{ color: accentColor }}>{displayName}</h2>
              {title && <p className="text-gray-500 text-sm">{title}</p>}
              {businessName && fullName && businessName !== displayName && (
                <p className="text-gray-400 text-xs">{fullName}</p>
              )}
            </div>
          </div>
          {hasContact && renderContacts('#555')}
        </div>
      </div>
    );
  }

  // Bold
  return (
    <div ref={cardRef} className="rounded-2xl overflow-hidden shadow-xl transition-all duration-300 w-full" style={{ maxWidth: 400, backgroundColor: accentColor }}>
      <div className="p-6 text-center">
        {photo && <img src={photo} alt={fullName} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-white/30" />}
        <h2 className="text-xl font-bold text-white">{displayName}</h2>
        {title && <p className="text-white/80 text-sm mt-1">{title}</p>}
        {businessName && fullName && businessName !== displayName && (
          <p className="text-white/70 text-xs mt-1">{fullName}</p>
        )}
      </div>
      {hasContact && (
        <div className="px-6 pb-6">
          {renderContacts('rgba(255,255,255,0.9)')}
        </div>
      )}
    </div>
  );
};

export default CardPreview;
