import { UserRole } from "./role-enum";

export interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}