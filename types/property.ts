export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];
  amenities: string[];
  available: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  category: {
    id: string;
    name: string;
  };
  landlord: {
    id: string;
    name: string;
    email: string;
  };
}