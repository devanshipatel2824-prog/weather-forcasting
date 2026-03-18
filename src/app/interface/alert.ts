export interface Alert {
  id?: string;
  title: string;
  message: string;
  roles: string[];   // 🔥 array must
  status: string;
  createdAt: any;
}