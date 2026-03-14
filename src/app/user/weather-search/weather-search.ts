import { AfterViewInit, Component } from '@angular/core';
import { WeatherData } from '../../interface/weather';
import { SearchHistory } from '../../interface/history';
import { WeatherService } from '../../firebase-service/weather-service';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserHeader } from "../user-header/user-header";
import { UserFooter } from "../user-footer/user-footer";
import * as L from 'leaflet';
@Component({
  selector: 'app-weather-search',
  imports: [CommonModule, FormsModule, UserHeader, UserFooter],
  templateUrl: './weather-search.html',
  styleUrl: './weather-search.css',
})
export class WeatherSearch implements AfterViewInit {
  city = ''
  weatherData?: WeatherData

  map: any
  marker: any

  constructor(
    private weatherService: WeatherService,
    private firebaseService: FirebaseService
  ) { }

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
}
