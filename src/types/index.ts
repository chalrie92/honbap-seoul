export interface MenuItem {
  name: string;
  price: string;
}

export interface Restaurant {
  id: string;
  name: string;
  nameJp: string;
  category: string;
  rating: number;
  reviews: number;
  address: string;
  tags: string[];
  imageUrl: string;
  menu?: MenuItem[];
  description?: string;
  naverMapUrl?: string;
  isSoloFriendly?: boolean;
  hasJapaneseMenu?: boolean;
  isLateNight?: boolean;
  coordinates?: { lat: number; lng: number } | null;
}
