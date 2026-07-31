export interface Property {
  id: string;

  title: string;
  description: string;

  price: number;

  city: string;
  state: string;
  neighborhood: string;
  location: string;
  address: string;

  bedrooms: number;
  bathrooms: number;
  sqft: number;

  images: string[];
  amenities: string[];

  available: boolean;
  featured: boolean;

  rating: number;
  reviewCount: number;

  availableFrom: string;

  categoryId: string;
  landlordId: string;

  category: {
    id: string;
    name: string;
  };

  landlord: {
    id: string;
    name: string;
    email: string;
  };

  createdAt?: string;
  updatedAt?: string;
}

export type Props = {
  searchParams: Promise<PropertyQuery>;
};

export type PropertyQuery = {
  city?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: number;
  limit?: number|string;
};