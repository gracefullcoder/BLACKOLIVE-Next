export interface UserData {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  isAdmin?: boolean;
  contact?: number;
  addresses?: Array<{
    number: number;
    address: string;
    landmark?: string;
    pincode: number;
  }>;
  orderDetails?: string[];
  cart?: string[];
  membershipStatus?: string[];
  createdAt?: string;
  updatedAt?: string;
}