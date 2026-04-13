export type CardStyle = 'modern' | 'clean' | 'bold' | 'minimal' | 'neon';

export interface CardData {
  fullName: string;
  title: string;
  businessName: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  tiktok: string;
  twitter: string;
  youtube: string;
  whatsapp: string;
  threads: string;
  address: string;
  photo: string;
  accentColor: string;
  cardStyle: CardStyle;
  showInitials: boolean;
}

export const emptyCard: CardData = {
  fullName: '',
  title: '',
  businessName: '',
  phone: '',
  email: '',
  website: '',
  instagram: '',
  facebook: '',
  linkedin: '',
  tiktok: '',
  twitter: '',
  youtube: '',
  whatsapp: '',
  threads: '',
  address: '',
  photo: '',
  accentColor: '#2D3748',
  cardStyle: 'modern',
  showInitials: true,
};

export const demoCard: CardData = {
  fullName: 'Jordan Rivera',
  title: 'Owner & Lead Stylist',
  businessName: 'Glow Studio',
  phone: '+1 (555) 234-5678',
  email: 'jordan@glowstudio.com',
  website: 'https://glowstudio.com',
  instagram: '@glowstudio',
  facebook: 'https://facebook.com/glowstudio',
  linkedin: 'https://linkedin.com/in/jordanrivera',
  tiktok: '@glowstudio',
  twitter: '',
  youtube: '',
  whatsapp: '',
  threads: '',
  address: '742 Elm Street, Suite 3, Portland, OR 97205',
  photo: '',
  accentColor: '#4A6741',
  cardStyle: 'modern',
  showInitials: true,
};
