export interface Property {
  id: string;

  title: string;
  description: string;

  price: number;

  city: string;
  state: string;
  neighborhood?: string;
  location?: string;
  address: string;

  bedrooms?: number | null;
  bathrooms?: number | null;
  sqft?: number | null;

  images: string[];
  amenities: string[];

  available: boolean;
  featured: boolean;

  rating: number;
  reviewCount: number;

  availableFrom?: string | null;

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

reviews?: Review[];

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
  limit?: number | string;
};

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  tenant: {
    id: string;
    name: string;
  };
}