import { Injectable } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  UpdateData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { FirebaseCollections } from '../firebase-service/firebase-enum';
import { FavoriteCity } from '../interface/favorite';
import { SearchHistory } from '../interface/history';
import { WeatherAlert } from '../interface/alert';
import { Firestore } from 'firebase/firestore';
// import { FavoriteCity } from '../../interface/favorite';
// import { SearchHistory } from '../../interface/history';
// import { WeatherAlert } from '../../interface/alert';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {

   constructor(private readonly firestore: Firestore) {}

  // ==============================
  // 🔥 COMMON GENERIC METHODS
  // ==============================

  public getCollection<T extends DocumentData>(
    collectionName: FirebaseCollections
  ): Observable<T[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const collectionQuery = query(collectionRef);

    return from(getDocs(collectionQuery)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc: { id: any; data: () => any; }) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as T[]
      )
    );
  }

  public addDocument<T extends DocumentData>(
    collectionName: FirebaseCollections,
    document: T
  ): Promise<DocumentReference<T>> {
    const collectionRef = collection(
      this.firestore,
      collectionName
    ) as CollectionReference<T, DocumentData>;

    return addDoc(collectionRef, document);
  }

  public updateDocument<T extends DocumentData>(
    collectionName: FirebaseCollections,
    documentId: string,
    document: UpdateData<T>
  ): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${documentId}`);
    return updateDoc(docRef, document);
  }

  public deleteDocument(
    collectionName: FirebaseCollections,
    documentId: string
  ): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${documentId}`);
    return deleteDoc(docRef);
  }

  // ==============================
  // ⭐ FAVORITES METHODS
  // ==============================

  addFavorite(city: string) {
    const data: FavoriteCity = {
      city,
      createdAt: new Date(),
    };

    return this.addDocument(FirebaseCollections.Favorites, data);
  }

  getFavorites(): Observable<FavoriteCity[]> {
    return this.getCollection<FavoriteCity>(
      FirebaseCollections.Favorites
    );
  }

  // ==============================
  // 📜 SEARCH HISTORY METHODS
  // ==============================

  addHistory(city: string) {
    const data: SearchHistory = {
      city,
      searchedAt: new Date(),
    };

    return this.addDocument(FirebaseCollections.SearchHistory, data);
  }

  getHistory(): Observable<SearchHistory[]> {
    return this.getCollection<SearchHistory>(
      FirebaseCollections.SearchHistory
    );
  }

  // ==============================
  // ⚠ ALERT METHODS
  // ==============================

  getAlerts(): Observable<WeatherAlert[]> {
    return this.getCollection<WeatherAlert>(
      FirebaseCollections.Alerts
    );
  }
}