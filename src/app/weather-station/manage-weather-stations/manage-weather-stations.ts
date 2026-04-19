import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WeatherStation } from '../../interface/weather-station';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from "../sidebar/sidebar";
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs } from '@angular/fire/firestore';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { map } from 'rxjs';
interface Station {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
}
@Component({
  selector: 'app-manage-weather-stations',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './manage-weather-stations.html',
  styleUrl: './manage-weather-stations.css',
})
export class ManageWeatherStations implements OnInit {
  stationName: string = '';
  targetCity: string = ''; // Aa dropdown mathi avse
  temperature: number = 0;
  windSpeed: number = 0;
  distance: string = '';

  allStations: any[] = [];
  searchHistoryList: any[] = []; // 🔥 New: Dropdown mate
  isLoading: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadStations();
    this.loadSearchHistory();
  }



  loadSearchHistory() {
    this.firebaseService.getCollection(FirebaseCollections.SearchHistory)
      .pipe(
        map((data: any[]) => {
          // Date wise sort: Latest search upar avse
          return data.sort((a, b) => {
            const timeA = a.timestamp?.seconds || 0;
            const timeB = b.timestamp?.seconds || 0;
            return timeB - timeA;
          });
        })
      )
      .subscribe((data) => {
        this.searchHistoryList = data;
        this.cdr.detectChanges();
      });
  }

  loadStations() {
    this.isLoading = true;
    this.firebaseService.getCollection(FirebaseCollections.WeatherStations)
      .subscribe({
        next: (data) => {
          this.allStations = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => { console.error(err); this.isLoading = false; }
      });
  }

  async addStation() {
    if (!this.stationName || !this.targetCity) {
      alert("Please select a City from dropdown!");
      return;
    }

    const newStation = {
      name: this.stationName,
      targetCity: this.targetCity.toLowerCase().trim(),
      temp: this.temperature,
      wind: this.windSpeed,
      distance: this.distance || '0',
      createdAt: new Date()
    };

    try {
      await this.firebaseService.addDocument(FirebaseCollections.WeatherStations, newStation);
      alert("Station added successfully!");
      this.resetForm();
      this.loadStations();
    } catch (error) { console.error(error); }
  }

  // Delete a station
  async deleteStation(id: string) {
    if (confirm("Are you sure you want to delete this station?")) {
      await this.firebaseService.deleteDocument(FirebaseCollections.WeatherStations, id);
      this.loadStations();
    }
  }

  resetForm() {
    this.stationName = '';
    this.targetCity = '';
    this.temperature = 0;
    this.windSpeed = 0;
    this.distance = '';
  }
}