import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../firebase-service/weather-service';
import { WeatherData } from '../../interface/weather';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoriteCity } from '../../interface/favorite';
import { SearchHistory } from '../../interface/history';
import { WeatherAlert } from '../../interface/alert';
import { FirebaseService } from '../../firebase-service/firebase-service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard implements OnInit {

  city: string = '';
  weather?: WeatherData;

  favorites: FavoriteCity[] = [];
  history: SearchHistory[] = [];
  alerts: WeatherAlert[] = [];

  constructor(
    private weatherService: WeatherService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
    this.loadHistory();
    this.loadAlerts();
  }

  // ======================
  // 🌦 SEARCH WEATHER
  // ======================

  search() {
    if (!this.city) return;

    this.weatherService.getWeather(this.city).subscribe({
      next: (data) => {
        this.weather = data;

        // Save search history using new method
        this.firebaseService.addHistory(this.city);

        this.loadHistory();
      },
      error: (err) => {
        console.error('Weather API Error', err);
      }
    });
  }

  // ======================
  // ⭐ ADD FAVORITE
  // ======================

  addToFavorites() {
    if (!this.weather) return;

    this.firebaseService.addFavorite(this.weather.city)
      .then(() => this.loadFavorites());
  }

  // ======================
  // 📥 LOAD DATA
  // ======================

  loadFavorites() {
    this.firebaseService.getFavorites()
      .subscribe(res => this.favorites = res);
  }

  loadHistory() {
    this.firebaseService.getHistory()
      .subscribe(res => this.history = res);
  }

  loadAlerts() {
    this.firebaseService.getAlerts()
      .subscribe(res => this.alerts = res);
  }

  // ======================
  // ❌ DELETE FAVORITE
  // ======================

  deleteFavorite(id: string) {
    this.firebaseService.deleteDocument('favorites' as any, id)
      .then(() => this.loadFavorites());
  }
}