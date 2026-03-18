export interface User {
registeredAt: Date;
id?: string;
name: string;
email: string;
password: string;
role: string;
city: string;
phone: string;
status?: 'pending' | 'approved' | 'rejected';  // pending / approved / rejected
createdAt: Date;

}