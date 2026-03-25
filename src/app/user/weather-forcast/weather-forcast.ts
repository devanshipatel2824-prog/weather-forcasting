import { Component, ChangeDetectorRef } from '@angular/core';
import { WeatherService } from '../../firebase-service/weather-service';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { UserFooter } from '../user-footer/user-footer';
import { UserHeader } from '../user-header/user-header';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-weather-forcast',
  standalone: true,
  imports: [CommonModule, UserFooter, UserHeader, FormsModule],
  templateUrl: './weather-forcast.html',
  styleUrl: './weather-forcast.css',
})
export class WeatherForcast {

  city = '';
  mapVisible = false;
  selectedForecast: any = null
  weatherData: any = {};
  forecastData: any[] = [];
  nearestStations: any[] = [];

  map: any;
  mainMarker: any;
  stationMarkers: any[] = [];

  constructor(private weatherService: WeatherService, private cdr: ChangeDetectorRef) { }

  searchWeather() {
    if (!this.city) return;

    this.weatherService.getWeather(this.city).subscribe(data => {
      this.weatherData = data;
      this.mapVisible = true;
      this.cdr.detectChanges();

      setTimeout(() => this.initMap(data.latitude, data.longitude), 100);

      this.weatherService.getForecast(this.city).subscribe(res => {
        this.forecastData = res;
        this.cdr.detectChanges();
      });

      this.getNearbyStations(data.latitude, data.longitude);
    });
  }

  initMap(lat: number, lon: number) {
    if (this.map) this.map.remove();

    this.map = L.map('map').setView([lat, lon], 12); // zoom in automatically

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    this.mainMarker = L.marker([lat, lon])
      .addTo(this.map)
      .bindPopup(`<b>${this.city}</b><br>🌡 ${this.weatherData.temperature}°C<br>💨 ${this.weatherData.wind} m/s<br>💧 ${this.weatherData.humidity}%`)
      .openPopup();

    setTimeout(() => this.map.invalidateSize(), 200);
  }

  getNearbyStations(lat: number, lon: number) {
    this.stationMarkers.forEach(m => this.map?.removeLayer(m));
    this.stationMarkers = [];
    this.nearestStations = [];

    fetch(`https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=15&appid=685efac5e35847415ea935663a61e193&units=metric`)
      .then(res => res.json())
      .then(res => {
        let stations = res.list.filter((st: any) => st.name && st.coord && st.main);
        stations.sort((a: any, b: any) => this.getDistance(lat, lon, a.coord.lat, a.coord.lon) - this.getDistance(lat, lon, b.coord.lat, b.coord.lon));
        stations = stations.slice(1, 6); // top 5 nearest

        stations.forEach((st: { coord: { lat: number; lon: number; }; name: any; main: { temp: any; }; wind: { speed: any; }; }) => {
          const distance = this.getDistance(lat, lon, st.coord.lat, st.coord.lon).toFixed(1);

          const marker = L.circleMarker([st.coord.lat, st.coord.lon], {
            radius: 7,
            color: '#ff6b6b',
            fillColor: '#ff6b6b',
            fillOpacity: 0.8
          }).addTo(this.map);

          marker.bindPopup(`<b>${st.name}</b><br>🌡 ${st.main.temp}°C<br>💨 ${st.wind?.speed || 0} m/s<br>📏 ${distance} km`);
          this.stationMarkers.push(marker);

          this.nearestStations.push({
            name: st.name,
            temp: st.main.temp,
            wind: st.wind?.speed || 0,
            distance
          });
        });

        this.cdr.detectChanges();
      });
  }

  getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  openForecastModal(forecast: any) {
    this.selectedForecast = forecast;
  }

  closeForecastModal() {
    this.selectedForecast = null;
  }
}