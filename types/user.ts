export type User = {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  role: "ADMIN" | "LANDLORD" | "TENANT";
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
};


export type UserResponse = {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: User;
};