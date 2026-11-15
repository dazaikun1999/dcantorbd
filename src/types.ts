export type DecantSize = '3ml' | '5ml' | '10ml' | '15ml';

export interface Perfume {
  id: number;
  name: string;
  brand: string;
  category: string;
  notes: string;
  inStock: boolean;
  prices: Partial<Record<DecantSize, number>>;
  image?: string;
  concentration?: string;
  description?: string;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
}

export interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  badge?: string;
  accentText?: string;
  bgGradient?: string;
  buttonText?: string;
  imageUrl?: string;
  imageLayout?: 'side' | 'full-bleed';
}

export interface CartItem {
  perfume: Perfume;
  selectedSize: DecantSize;
  price: number;
  quantity: number;
}
