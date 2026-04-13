export type CardStyle = 'modern' | 'clean' | 'bold';

export interface CardData {
  fullName: string;
  title: string;
  businessName: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  facebook: string;
  address: string;
  photo: string;
  accentColor: string;
  cardStyle: CardStyle;
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
  address: '',
  photo: '',
  accentColor: '#1a1a2e',
  cardStyle: 'modern',
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
  address: '742 Elm Street, Suite 3, Portland, OR 97205',
  photo: '',
  accentColor: '#6d28d9',
  cardStyle: 'modern',
};
