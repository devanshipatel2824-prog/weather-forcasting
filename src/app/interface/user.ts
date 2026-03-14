export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  city: string;
  phone: string;
  createdAt: Date;
}