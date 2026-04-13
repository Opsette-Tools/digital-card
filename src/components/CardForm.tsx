import React, { useRef, useState } from 'react';
import { CardData, demoCard, emptyCard } from '@/types/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface CardFormProps {
  card: CardData;
  onChange: (card: CardData) => void;
}

const CardForm: React.FC<CardFormProps> = ({ card, onChange }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showSocials, setShowSocials] = useState(false);
  const isEmpty = !card.fullName && !card.email && !card.phone;

  const set = (key: keyof CardData, value: string) => onChange({ ...card, [key]: value });

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set('photo', reader.result as string);
    reader.readAsDataURL(file);
  };

  const hasSocials = card.linkedin || card.tiktok || card.twitter || card.youtube || card.whatsapp || card.threads;

  return (
    <div className="space-y-4">
      {/* Quick actions */}
      <div className="flex items-center gap-2">
        {isEmpty && (
          <button
            onClick={() => onChange({ ...demoCard })}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-border hover:bg-accent transition-colors text-muted-foreground"
          >
            Load example
          </button>
        )}
        {!isEmpty && (
          <button
            onClick={() => { onChange({ ...emptyCard }); if (fileRef.current) fileRef.current.value = ''; }}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-border hover:bg-accent transition-colors text-muted-foreground"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="fullName" className="text-xs text-muted-foreground">Full Name</Label>
          <Input id="fullName" value={card.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Jordan Rivera" className="h-11 bg-secondary/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="title" className="text-xs text-muted-foreground">Title</Label>
            <Input id="title" value={card.title} onChange={e => set('title', e.target.value)} placeholder="Lead Stylist" className="h-11 bg-secondary/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]" />
          </div>
          <div>
            <Label htmlFor="businessName" className="text-xs text-muted-foreground">Business</Label>
            <Input id="businessName" value={card.businessName} onChange={e => set('businessName', e.target.value)} placeholder="Glow Studio" className="h-11 bg-secondary/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="phone" className="text-xs text-muted-foreground">Phone</Label>
            <Input id="phone" type="tel" value={card.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 555 234 5678" className="h-11 bg-secondary/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]" />
          </div>
          <div>
            <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
            <Input id="email" type="email" value={card.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" className="h-11 bg-secondary/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]" />
          </div>
        </div>
        <div>
          <Label htmlFor="website" className="text-xs text-muted-foreground">Website</Label>
          <Input id="website" type="url" value={card.website} onChange={e => set('website', e.target.value)} placeholder="https://yoursite.com" className="h-11 bg-secondary/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="instagram" className="text-xs text-muted-foreground">Instagram</Label>
            <Input id="instagram" value={card.instagram} onChange={e => set('instagram', e.target.value)} placeholder="@handle" className="h-11 bg-secondary/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]" />
          </div>
          <div>
            <Label htmlFor="facebook" className="text-xs text-muted-foreground">Facebook</Label>
            <Input id="facebook" type="url" value={card.facebook} onChange={e => set('facebook', e.target.value)} placeholder="facebook.com/page" className="h-11 bg-secondary/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]" />
          </div>
        </div>

        {/* Expandable socials */}
        <button
          type="button"
          onClick={() => setShowSocials(!showSocials)}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
        >
          {showSocials ? '- fewer fields' : '+ more socials'}
          {hasSocials && !showSocials && <span className="ml-1 opacity-50">*</span>}
        </button>

        {showSocials && (
          <div className="space-y-3 pl-3 border-l-2 border-border/40">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="linkedin" className="text-xs text-muted-foreground">LinkedIn</Label>
                <Input id="linkedin" type="url" value={card.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="linkedin.com/in/you" className="h-11 bg-secondary/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]" />
              </div>
              <div>
                <Label htmlFor="tiktok" className="text-xs text-muted-foreground">TikTok</Label>
                <Input id="tiktok" value={card.tiktok} onChange={e => set('tiktok', e.target.value)} placeholder="@handle" className="h-11 bg-secondary/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="twitter" className="text-xs text-muted-foreground">X / Twitter</Label>
                <Input id="twitter" value={card.twitter} onChange={e => set('twitter', e.target.value)} placeholder="@handle" className="h-11 bg-secondary/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]" />
              </div>
              <div>
                <Label htmlFor="youtube" className="text-xs text-muted-foreground">YouTube</Label>
                <Input id="youtube" type="url" value={card.youtube} onChange={e => set('youtube', e.target.value)} placeholder="youtube.com/@ch" className="h-11 bg-secondary/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="whatsapp" className="text-xs text-muted-foreground">WhatsApp</Label>
                <Input id="whatsapp" type="tel" value={card.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+1 555 234 5678" className="h-11 bg-secondary/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]" />
              </div>
              <div>
                <Label htmlFor="threads" className="text-xs text-muted-foreground">Threads</Label>
                <Input id="threads" value={card.threads} onChange={e => set('threads', e.target.value)} placeholder="@handle" className="h-11 bg-secondary/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]" />
              </div>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="address" className="text-xs text-muted-foreground">Address</Label>
          <Input id="address" value={card.address} onChange={e => set('address', e.target.value)} placeholder="123 Main St, City, State" className="h-11 bg-secondary/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]" />
        </div>
        <div>
          <Label htmlFor="photo" className="text-xs text-muted-foreground">Photo / Logo</Label>
          <Input id="photo" ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="h-11 bg-secondary/40" />
          {card.photo && (
            <button className="mt-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors" onClick={() => { set('photo', ''); if (fileRef.current) fileRef.current.value = ''; }}>
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardForm;
