import React, { useRef } from 'react';
import { CardData, CardStyle, demoCard, emptyCard } from '@/types/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sparkles, Trash2 } from 'lucide-react';

interface CardFormProps {
  card: CardData;
  onChange: (card: CardData) => void;
}

const STYLES: { value: CardStyle; label: string; description: string }[] = [
  { value: 'modern', label: 'Monogram Panel', description: 'Large first + last initials on a side block' },
  { value: 'clean', label: 'Wordmark Badge', description: 'Initials badge sits beside the business name' },
  { value: 'bold', label: 'Signature Band', description: 'Dramatic full-bleed card with a contact band' },
];

const COLORS = ['#1a1a2e', '#6d28d9', '#0369a1', '#059669', '#dc2626', '#d97706', '#db2777'];

const CardForm: React.FC<CardFormProps> = ({ card, onChange }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof CardData, value: string) => onChange({ ...card, [key]: value });

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set('photo', reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="min-h-[44px]" onClick={() => onChange({ ...demoCard })}>
          <Sparkles size={16} className="mr-1" /> Try Demo
        </Button>
        <Button variant="outline" size="sm" className="min-h-[44px]" onClick={() => { onChange({ ...emptyCard }); if (fileRef.current) fileRef.current.value = ''; }}>
          <Trash2 size={16} className="mr-1" /> Clear
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input id="fullName" value={card.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Jordan Rivera" className="min-h-[44px]" />
        </div>
        <div>
          <Label htmlFor="title">Title / Role</Label>
          <Input id="title" value={card.title} onChange={e => set('title', e.target.value)} placeholder="Owner & Lead Stylist" className="min-h-[44px]" />
        </div>
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input id="businessName" value={card.businessName} onChange={e => set('businessName', e.target.value)} placeholder="Glow Studio" className="min-h-[44px]" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" value={card.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 234-5678" className="min-h-[44px]" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={card.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" className="min-h-[44px]" />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" type="url" value={card.website} onChange={e => set('website', e.target.value)} placeholder="https://yoursite.com" className="min-h-[44px]" />
        </div>
        <div>
          <Label htmlFor="instagram">Instagram</Label>
          <Input id="instagram" value={card.instagram} onChange={e => set('instagram', e.target.value)} placeholder="@yourhandle" className="min-h-[44px]" />
        </div>
        <div>
          <Label htmlFor="facebook">Facebook URL</Label>
          <Input id="facebook" type="url" value={card.facebook} onChange={e => set('facebook', e.target.value)} placeholder="https://facebook.com/yourpage" className="min-h-[44px]" />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" value={card.address} onChange={e => set('address', e.target.value)} placeholder="123 Main St, City, State" className="min-h-[44px]" />
        </div>
        <div>
          <Label htmlFor="photo">Logo / Photo</Label>
          <Input id="photo" ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="min-h-[44px]" />
          {card.photo && (
            <Button variant="ghost" size="sm" className="mt-1 text-xs min-h-[44px]" onClick={() => { set('photo', ''); if (fileRef.current) fileRef.current.value = ''; }}>
              Remove photo
            </Button>
          )}
        </div>
      </div>

      <div>
        <Label>Card Concept</Label>
        <div className="mt-2 grid gap-2">
          {STYLES.map(style => {
            const selected = card.cardStyle === style.value;
            return (
              <Button
                key={style.value}
                variant={selected ? 'default' : 'outline'}
                className="h-auto min-h-[60px] w-full justify-start px-4 py-3 text-left"
                onClick={() => set('cardStyle', style.value)}
              >
                <span className="flex flex-col items-start gap-1">
                  <span className="font-medium leading-none">{style.label}</span>
                  <span className={selected ? 'text-xs opacity-80' : 'text-xs text-muted-foreground'}>{style.description}</span>
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      <div>
        <Label>Accent Color</Label>
        <div className="flex gap-2 mt-1 flex-wrap">
          {COLORS.map(c => (
            <button
              key={c}
              className="w-9 h-9 rounded-full border-2 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              style={{ backgroundColor: c, borderColor: card.accentColor === c ? '#fff' : 'transparent', boxShadow: card.accentColor === c ? `0 0 0 2px ${c}` : 'none' }}
              onClick={() => set('accentColor', c)}
              aria-label={`Color ${c}`}
            />
          ))}
          <input
            type="color"
            value={card.accentColor}
            onChange={e => set('accentColor', e.target.value)}
            className="w-9 h-9 rounded-full cursor-pointer min-w-[44px] min-h-[44px] border-0 p-0"
            title="Custom color"
          />
        </div>
      </div>
    </div>
  );
};

export default CardForm;
