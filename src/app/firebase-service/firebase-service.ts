import { Injectable } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
  UpdateData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  docData,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { FirebaseCollections } from '../firebase-service/firebase-enum';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { SearchHistory } from '../interface/history';
import { FavoriteCity } from '../interface/favorite';
import { User } from '../interface/user';
import { WeatherData } from '../interface/weather-data';
import { WeatherStation } from '../interface/weather-station';
import { Alert } from '../interface/alert';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private firestore: Firestore, private router: Router) { }

  canActivate(): boolean {
    const userStr = localStorage.getItem('loggedInUser');
    if (!userStr) {
      this.router.navigate(['/user/user-login']);
      return false;
    }
    const user: User = JSON.parse(userStr);
    if (user.status !== 'approved') {
      alert('Your account is not approved yet!');
      this.router.navigate(['/user/user-login']);
      return false;
    }
    return true;
  }
  public getDocumentsByField<T extends DocumentData>(
    collectionName: FirebaseCollections,
    field: string,
    value: any
  ): Observable<T[]> {

    const collectionRef = collection(this.firestore, collectionName);
    const q = query(collectionRef, where(field, '==', value));

    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as unknown as T[];
      })
    );

  }
  uploadVideo(file: any) {
    throw new Error('Method not implemented.');
  }


  // ===============================
  // GET COLLECTION
  // ===============================
  public getCollection<T extends DocumentData>(
    collectionName: FirebaseCollections
  ): Observable<T[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const collectionQuery = query(collectionRef);
    return from(getDocs(collectionQuery)).pipe(
      map((snapshot) => {
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as T[];
      })
    );
  }

  // ===============================
  // GET DOCUMENT
  // ===============================
  public getDocument<T extends DocumentData>(
    collectionName: FirebaseCollections,
    documentId: string
  ): Observable<T | undefined> {

    const collectionRef = collection(this.firestore, collectionName);
    const docRef = doc(collectionRef, documentId);

    return from(getDoc(docRef)).pipe(
      map((snapshot) => {
        if (!snapshot.exists()) {
          return undefined;
        }
        return {
          id: snapshot.id,
          ...snapshot.data(),
        } as unknown as T;
      })
    );
  }

  // ===============================
  // ADD DOCUMENT
  // ===============================
  public addDocument<T extends DocumentData>(
    collectionName: FirebaseCollections,
    document: T
  ): Promise<DocumentReference<T>> {
    const collectionRef = collection(
      this.firestore,
      collectionName
    ) as CollectionReference<T, DocumentData>;

    return addDoc<T, DocumentData>(collectionRef, document);
  }

  // ===============================
  // UPDATE DOCUMENT
  // ===============================
  public updateDocument<T extends DocumentData>(
    collectionName: FirebaseCollections,
    documentId: string,
    document: UpdateData<T>
  ): Promise<void> {
    const collectionRef = collection(this.firestore, collectionName);
    const docRef = doc(
      collectionRef,
      documentId
    ) as DocumentReference<T, DocumentData>;

    return updateDoc(docRef, document);
  }

  // ===============================
  // DELETE DOCUMENT
  // ===============================
  public deleteDocument<T extends DocumentData>(
    collectionName: FirebaseCollections,
    documentId: string
  ): Promise<void> {
    const collectionRef = collection(this.firestore, collectionName);
    const docRef = doc(
      collectionRef,
      documentId
    ) as DocumentReference<T, DocumentData>;

    return deleteDoc(docRef);
  }

  // ===============================
  // FILE UPLOAD
  // ===============================
  async uploadFile(path: string, file: File) {

    const storage = getStorage();

    const storageRef = ref(storage, path);

    const uploadResult = await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(uploadResult.ref);

    return { downloadURL };

  }
  // -----------------------------
  // Search History
  // -----------------------------
  addHistory(city: string) {
    return this.addDocument(FirebaseCollections.SearchHistory, {
      city,
      searchedAt: new Date()
    });
  }

  getHistory(): Observable<SearchHistory[]> {
    return this.getCollection<SearchHistory>(FirebaseCollections.SearchHistory);
  }

  deleteHistory(id: string) {
    return this.deleteDocument(FirebaseCollections.SearchHistory, id);
  }

  // -----------------------------
  // Favorite Cities
  // -----------------------------
  addFavorite(city: FavoriteCity) {
    if (!city?.city || !city?.country) {
      console.error("Cannot add favorite: city or country missing", city);
      return Promise.reject("City or country is missing");
    }
    const ref = collection(this.firestore, FirebaseCollections.Favorites) as CollectionReference<FavoriteCity>;
    return addDoc(ref, city);
  }

  // FirebaseService
  public getAllFavorites(): Observable<FavoriteCity[]> {
    return this.getCollection<FavoriteCity>(FirebaseCollections.Favorites);
  }

  // Optionally, add delete favorite
  public deleteFavoriteCity(favId: string): Promise<void> {
    return this.deleteDocument(FirebaseCollections.Favorites, favId);
  }
  // ===============================
  // GET ALL USERS
  // ===============================
  public getAllUsers(): Observable<User[]> {
    return this.getCollection<User>(FirebaseCollections.Users);
  }

  // ===============================
  // UPDATE USER STATUS
  // ===============================
  public updateUserStatus(userId: string, status: 'approved' | 'rejected'): Promise<void> {
    return this.updateDocument<User>(FirebaseCollections.Users, userId, { status });
  }
  // ===============================
  // WEATHER STATIONS
  // ===============================
  public addWeatherStation(station: WeatherStation) {
    return this.addDocument(FirebaseCollections.WeatherStations, station);
  }

  public getAllWeatherStations(): Observable<WeatherStation[]> {
    return this.getCollection<WeatherStation>(FirebaseCollections.WeatherStations);
  }

  public updateWeatherStation(stationId: string, data: Partial<WeatherStation>) {
    return this.updateDocument(FirebaseCollections.WeatherStations, stationId, data);
  }

  public deleteWeatherStation(stationId: string) {
    return this.deleteDocument(FirebaseCollections.WeatherStations, stationId);
  }
  // public getStationById(id: string): Observable<WeatherStation> {
  //   return this.getDocument<WeatherStation>(FirebaseCollections.WeatherStations, id);
  // }
  // ===============================
  // WEATHER DATA
  // ===============================
  public addWeatherData(data: WeatherData) {
    return this.addDocument(FirebaseCollections.WeatherData, data);
  }

  public getWeatherDataByStation(stationId: string): Observable<WeatherData[]> {
    return this.getDocumentsByField<WeatherData>(FirebaseCollections.WeatherData, 'stationId', stationId);
  }

  public getAllWeatherData(): Observable<WeatherData[]> {
    return this.getCollection<WeatherData>(FirebaseCollections.WeatherData);
  }

  public deleteWeatherData(weatherId: string) {
    return this.deleteDocument(FirebaseCollections.WeatherData, weatherId);
  }
  // ===============================
  // ALERTS
  // ===============================
  public addAlert(alert: Alert) {
    return this.addDocument(FirebaseCollections.Alerts, alert);
  }

  public getAllAlerts(): Observable<Alert[]> {
    return this.getCollection<Alert>(FirebaseCollections.Alerts);
  }

  // For user-specific alerts (targetUsers)
  public getAlertsForUser(userId: string): Observable<Alert[]> {
    return this.getDocumentsByField<Alert>(FirebaseCollections.Alerts, 'targetUsers', userId);
  }

  public updateAlert(alertId: string, data: Partial<Alert>) {
    return this.updateDocument(FirebaseCollections.Alerts, alertId, data);
  }

  public deleteAlert(alertId: string) {
    return this.deleteDocument(FirebaseCollections.Alerts, alertId);
  }
  // 🔹 Add Weather Station (Admin)
  addStation(station: any) {
    const ref = collection(this.firestore, 'weatherStations');
    return addDoc(ref, station);
  }

  // 🔹 Get All Stations
  async getStations() {
    const ref = collection(this.firestore, 'weatherStations');
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => doc.data());
  }



  // 🔹 Get Weather Data by Station
  async getWeatherByStation(stationId: string) {
    const ref = collection(this.firestore, 'weatherData');
    const q = query(ref, where('stationId', '==', stationId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  }
}