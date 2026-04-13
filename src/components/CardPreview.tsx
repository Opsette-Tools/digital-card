import React from 'react';
import { CardData } from '@/types/card';
import { Phone, Mail, Globe, Instagram, Facebook, MapPin } from 'lucide-react';

interface CardPreviewProps {
  card: CardData;
  cardRef?: React.RefObject<HTMLDivElement>;
}

const ContactItem = ({ icon: Icon, value, href, light = false }: { icon: React.ElementType; value: string; href?: string; light?: boolean }) => {
  if (!value) return null;
  const content = (
    <span className={`flex items-center gap-3 text-[13px] leading-tight min-h-[40px] py-1.5 transition-colors ${light ? 'text-white/85 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
      <span className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${light ? 'bg-white/15' : 'bg-gray-100'}`}>
        <Icon size={14} className={light ? 'text-white/90' : 'text-gray-500'} />
      </span>
      <span className="break-all">{value}</span>
    </span>
  );
  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:translate-x-0.5 transition-transform">{content}</a>;
  }
  return <div>{content}</div>;
};

const ContactList = ({ card, light = false }: { card: CardData; light?: boolean }) => {
  const { phone, email, website, instagram, facebook, address } = card;
  const igHandle = instagram?.replace('@', '');
  const igUrl = igHandle ? `https://instagram.com/${igHandle}` : undefined;

  return (
    <div className="space-y-0.5">
      <ContactItem icon={Phone} value={phone} href={phone ? `tel:${phone}` : undefined} light={light} />
      <ContactItem icon={Mail} value={email} href={email ? `mailto:${email}` : undefined} light={light} />
      <ContactItem icon={Globe} value={website?.replace(/^https?:\/\//, '')} href={website} light={light} />
      <ContactItem icon={Instagram} value={instagram} href={igUrl} light={light} />
      <ContactItem icon={Facebook} value={facebook ? 'Facebook' : ''} href={facebook} light={light} />
      <ContactItem icon={MapPin} value={address} light={light} />
    </div>
  );
};

const CardPreview: React.FC<CardPreviewProps> = ({ card, cardRef }) => {
  const { fullName, title, businessName, phone, email, website, instagram, facebook, address, photo, accentColor, cardStyle } = card;

  const hasContact = phone || email || website || instagram || facebook || address;
  const displayName = businessName || fullName || 'Your Card';
  const subtitle = businessName && fullName && businessName !== displayName ? fullName : undefined;

  // Generate a lighter tint of the accent color for gradients
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  const rgb = hexToRgb(accentColor || '#1a1a2e');
  const lighterAccent = `rgba(${Math.min(rgb.r + 40, 255)}, ${Math.min(rgb.g + 40, 255)}, ${Math.min(rgb.b + 40, 255)}, 1)`;

  // ── Modern: Split hero header with geometric accent + white body ──
  if (cardStyle === 'modern') {
    return (
      <div ref={cardRef} className="rounded-2xl overflow-hidden transition-all duration-500 w-full" style={{ maxWidth: 400, boxShadow: `0 25px 60px -15px ${accentColor}40, 0 10px 20px -5px rgba(0,0,0,0.1)` }}>
        {/* Hero section with diagonal accent */}
        <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${accentColor}, ${lighterAccent})` }}>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(-30%, 30%)' }} />
          
          <div className="relative z-10 px-7 pt-8 pb-7">
            <div className="flex items-start gap-4">
              {photo ? (
                <img src={photo} alt={fullName} className="w-[72px] h-[72px] rounded-2xl object-cover shadow-lg" style={{ border: '3px solid rgba(255,255,255,0.3)' }} />
              ) : (
                <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg" style={{ background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)', border: '3px solid rgba(255,255,255,0.15)' }}>
                  {(fullName || 'Y')[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0 pt-1">
                <h2 className="text-[22px] font-bold text-white leading-tight tracking-tight truncate">{displayName}</h2>
                {title && <p className="text-white/75 text-sm mt-1 leading-snug">{title}</p>}
                {subtitle && <p className="text-white/55 text-xs mt-1">{subtitle}</p>}
              </div>
            </div>
          </div>
          
          {/* Wave divider */}
          <svg viewBox="0 0 400 24" className="w-full block" preserveAspectRatio="none">
            <path d="M0,24 L0,8 Q100,0 200,12 Q300,24 400,8 L400,24 Z" fill="white" />
          </svg>
        </div>

        {/* Contact body */}
        {hasContact && (
          <div className="bg-white px-7 pb-7 pt-2">
            <ContactList card={card} />
          </div>
        )}

        {/* Bottom accent bar */}
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${accentColor}, ${lighterAccent}, ${accentColor})` }} />
      </div>
    );
  }

  // ── Clean: Elegant minimalist with accent line & refined spacing ──
  if (cardStyle === 'clean') {
    return (
      <div ref={cardRef} className="rounded-2xl overflow-hidden bg-white transition-all duration-500 w-full" style={{ maxWidth: 400, boxShadow: '0 20px 50px -12px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.05)' }}>
        {/* Top accent strip */}
        <div className="h-2" style={{ background: `linear-gradient(90deg, ${accentColor}, ${lighterAccent})` }} />

        <div className="px-7 pt-7 pb-2">
          {/* Header with photo */}
          <div className="flex items-center gap-5 mb-6">
            {photo ? (
              <div className="relative shrink-0">
                <img src={photo} alt={fullName} className="w-[68px] h-[68px] rounded-full object-cover" />
                <div className="absolute inset-0 rounded-full" style={{ border: `2.5px solid ${accentColor}`, opacity: 0.6 }} />
              </div>
            ) : (
              <div className="w-[68px] h-[68px] rounded-full flex items-center justify-center text-xl font-bold shrink-0" style={{ background: `${accentColor}15`, color: accentColor }}>
                {(fullName || 'Y')[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 leading-tight tracking-tight truncate">{displayName}</h2>
              {title && <p className="text-gray-500 text-sm mt-1">{title}</p>}
              {subtitle && <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px mb-5" style={{ background: `linear-gradient(90deg, ${accentColor}30, ${accentColor}08)` }} />
        </div>

        {/* Contact info */}
        {hasContact && (
          <div className="px-7 pb-7">
            <ContactList card={card} />
          </div>
        )}
      </div>
    );
  }

  // ── Bold: Full-bleed color with frosted glass contact section ──
  return (
    <div ref={cardRef} className="rounded-2xl overflow-hidden transition-all duration-500 w-full" style={{ maxWidth: 400, boxShadow: `0 25px 60px -15px ${accentColor}50, 0 10px 20px -5px rgba(0,0,0,0.15)` }}>
      {/* Full color background */}
      <div className="relative" style={{ background: `linear-gradient(160deg, ${lighterAccent}, ${accentColor})` }}>
        {/* Decorative circles */}
        <div className="absolute top-4 right-6 w-40 h-40 rounded-full opacity-[0.07]" style={{ background: 'white' }} />
        <div className="absolute bottom-16 left-4 w-20 h-20 rounded-full opacity-[0.07]" style={{ background: 'white' }} />
        <div className="absolute top-20 right-20 w-8 h-8 rounded-full opacity-[0.12]" style={{ background: 'white' }} />

        {/* Identity section */}
        <div className="relative z-10 px-7 pt-9 pb-6 text-center">
          {photo ? (
            <img src={photo} alt={fullName} className="w-[88px] h-[88px] rounded-full mx-auto mb-4 object-cover shadow-xl" style={{ border: '4px solid rgba(255,255,255,0.25)' }} />
          ) : (
            <div className="w-[88px] h-[88px] rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold shadow-xl" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', border: '4px solid rgba(255,255,255,0.15)' }}>
              {(fullName || 'Y')[0]?.toUpperCase()}
            </div>
          )}
          <h2 className="text-2xl font-bold text-white leading-tight tracking-tight">{displayName}</h2>
          {title && <p className="text-white/70 text-sm mt-1.5 font-medium">{title}</p>}
          {subtitle && <p className="text-white/50 text-xs mt-1">{subtitle}</p>}
        </div>

        {/* Frosted glass contact section */}
        {hasContact && (
          <div className="relative z-10 mx-4 mb-5 rounded-xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <ContactList card={card} light />
          </div>
        )}

        {/* Bottom accent */}
        <div className="h-1" style={{ background: 'rgba(255,255,255,0.15)' }} />
      </div>
    </div>
  );
};

export default CardPreview;
