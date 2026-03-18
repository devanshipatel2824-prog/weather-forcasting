export interface FavoriteCity {
  id?: string;        // 🔥 important (Firestore doc id)
  city: string;
  country: string;
  addedAt: any;
  userId?: string;    // 🔥 user wise data
}