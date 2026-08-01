export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  images: string[];
  bedrooms?: number | null;
  bathrooms?: number | null;
}

export interface Payment {
  id: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  amount: number;
  paidAt?: string | null;
}

export interface RentalRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  message?: string | null;
  status: RequestStatus;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
  property: Property;
  payment?: Payment[];
}

export interface CreateRentalRequestPayload {
  propertyId: string;
  message?: string;
  startDate?: string;
  endDate?: string;
}