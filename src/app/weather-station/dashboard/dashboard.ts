import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { WeatherStation } from '../../interface/weather-station';
import { Sidebar } from "../sidebar/sidebar";
import { WeatherData } from '../../interface/weather-data';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  stations: WeatherStation[] = [];
  weatherData: WeatherData[] = [];

  // Dashboard stats
  totalStations = 0;
  activeStations = 0;
  inactiveStations = 0;
  totalWeatherRecords = 0;

  constructor(private firebaseService: FirebaseService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadStations();
    this.loadWeatherData();
    this.cdr.detectChanges();
  }

  loadStations() {
    this.firebaseService.getAllWeatherStations().subscribe(stations => {
      this.stations = stations;
      this.totalStations = stations.length;
      this.activeStations = stations.filter(s => s.status === 'Active').length;
      this.inactiveStations = stations.filter(s => s.status === 'Inactive').length;
      this.cdr.detectChanges();
    });
  }

  loadWeatherData() {
    this.firebaseService.getAllWeatherData().subscribe(data => {
      this.weatherData = data;
      this.totalWeatherRecords = data.length;
      this.cdr.detectChanges();
    });
  }

  deleteStation(id: string) {
    if (confirm('Are you sure you want to delete this station?')) {
      this.firebaseService.deleteWeatherStation(id).then(() => this.loadStations());
      this.cdr.detectChanges();
    }
  }

  deleteWeatherData(id: string) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.firebaseService.deleteWeatherData(id).then(() => this.loadWeatherData());
      this.cdr.detectChanges();
    }
  }
}
