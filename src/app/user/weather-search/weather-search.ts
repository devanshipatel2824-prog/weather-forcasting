import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WeatherData } from '../../interface/weather';
import { SearchHistory } from '../../interface/history';
import { WeatherService } from '../../firebase-service/weather-service';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserHeader } from "../user-header/user-header";
import { UserFooter } from "../user-footer/user-footer";
import * as L from 'leaflet';
import { ActivatedRoute } from '@angular/router';
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'layers.jpg',
  iconUrl: 'marker-icon.jpg',
  shadowUrl: 'marker-shadow.jpg'
});
@Component({
  selector: 'app-weather-search',
  imports: [CommonModule, FormsModule, UserHeader, UserFooter],
  templateUrl: './weather-search.html',
  styleUrl: './weather-search.css',
})
export class WeatherSearch implements AfterViewInit, OnInit {
  city = ''
  weatherData?: WeatherData

  map: any
  marker: any
  isLoggedIn(): boolean {
    return !!localStorage.getItem('loggedInUser');
  }
  constructor(
    private weatherService: WeatherService,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef

  ) { }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['city']) {
        this.city = params['city'];
        this.searchWeather();
      }
    });
  }
  ngAfterViewInit() {

    this.map = L.map('map').setView([22.9734, 78.6569], 5)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap'
    }).addTo(this.map)

  }

  searchWeather() {

    if (!this.city) return

    this.weatherService.getWeather(this.city).subscribe(data => {

      this.weatherData = data

      this.firebaseService.addHistory(this.city)

      // map location update
      this.showLocation(data.latitude, data.longitude, data.city)
      this.cdr.detectChanges(); // 🔥
    })

  }

  showLocation(lat: number, lon: number, city: string) {

    this.map.setView([lat, lon], 10)

    if (this.marker) {
      this.map.removeLayer(this.marker)
    }

    this.marker = L.marker([lat, lon]).addTo(this.map)
      .bindPopup(city)
      .openPopup()

  }
  // ==============================
  // ADD FAVORITE CITY
  // ==============================
  addFavorite() {
    if (!this.weatherData) {
      alert('Search a city first!');
      return;
    }

    const cityData = {
      city: this.weatherData.city,
      country: 'IN',          // make sure country is saved
      addedAt: new Date()     // timestamp when added
    };

    this.firebaseService.addFavorite(cityData)
      .then(() => alert(`${cityData.city} added to favorites!`))
      .catch(err => {
        console.error(err);
        alert('Failed to add favorite.');
      });
  }
}
