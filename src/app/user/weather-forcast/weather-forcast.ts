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
  slot: any;

  constructor(private weatherService: WeatherService, private cdr: ChangeDetectorRef) { }

  searchWeather() {
    if (!this.city) return;

    this.weatherService.getWeather(this.city).subscribe(data => {

      this.weatherData = data;
      this.mapVisible = true;
      this.cdr.detectChanges();

      setTimeout(() => this.initMap(data.latitude, data.longitude), 100);

      // ✅ DETAILED FORECAST
      this.weatherService.getDetailedForecast(this.city)
        .subscribe((res: any) => {

          const grouped: any = {};

          res.list.forEach((item: any) => {

            const date = item.dt_txt.split(' ')[0];
            const time = item.dt_txt.split(' ')[1];
            const formattedTime = new Date(item.dt_txt).toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit'
            });
            let slot = '';

            if (time.includes('06:00')) slot = 'AM';
            else if (time.includes('12:00')) slot = 'PM';
            else if (time.includes('18:00')) slot = 'Night';
            else return; // 👈 skip baki time (IMPORTANT)

            // ✅ day create
            if (!grouped[date]) {
              grouped[date] = {
                date: new Date(date).toDateString(),
                slots: {
                  AM: this.getEmptySlot('AM'),
                  PM: this.getEmptySlot('PM'),
                  Night: this.getEmptySlot('Night')
                }
              };
            }

            // ✅ slot assign (NO push)
            grouped[date].slots[slot] = {
              slot,
              time: formattedTime,   // ✅ NEW
              temp: Math.round(item.main.temp),

              min: Math.round(item.main.temp_min ?? item.main.temp - 2),
              max: Math.round(item.main.temp_max ?? item.main.temp + 2),

              humidity: item.main.humidity ?? 0,
              wind: Math.round((item.wind?.speed ?? 0) * 3.6),
              condition: item.weather[0]?.description || 'Clear',
              hour: new Date(item.dt_txt).getHours()
            };
          });

          // ✅ FINAL FORMAT
          this.forecastData = Object.values(grouped).map((day: any) => ({
            date: day.date,
            slots: [
              day.slots.AM,
              day.slots.PM,
              day.slots.Night
            ]
          }));
          // 🔥 NEW ADD START
          const currentHour = new Date().getHours();

this.forecastData = this.forecastData.map((day: any, index: number) => {

  if (index === 0) {

    day.slots = day.slots.filter((slot: any) => {

      if (!slot) return false;

      if (currentHour >= 12 && slot.slot === 'AM') return false;
      if (currentHour >= 18 && slot.slot === 'PM') return false;

      return true;
    });

  }

  return day;
});

// 🔥 empty day remove
this.forecastData = this.forecastData.filter(day => day.slots.length > 0);
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

  getIcon(condition: string, hour: number): string {

    condition = condition?.toLowerCase() || '';

    // 🌧 Rain
    if (condition.includes('rain')) return '🌧';

    // ☁ Cloud
    if (condition.includes('cloud')) return '☁️';

    // ⛈ Storm
    if (condition.includes('storm')) return '⛈';

    // ❄ Snow
    if (condition.includes('snow')) return '❄️';

    // 🔥 DAY / NIGHT LOGIC
    if (hour >= 6 && hour < 18) {
      return '☀️';  // Day
    } else {
      return '🌙';  // Night
    }
  }

  getBarWidth(min: number, max: number): number {
    const diff = max - min;
    return Math.min(diff * 10, 100);
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
  getTimeSlots() {
    if (!this.forecastData.length) return [];

    return this.forecastData[0].data.map((d: any) => d.time);
  }
  openMap() {
  window.open('/map-page', '_blank');
}
  getEmptySlot(type: string) {
    return {
      slot: type,
      temp: 0,
      min: 0,
      max: 0,
      humidity: 0,
      wind: 0,
      condition: 'Clear'
    };
  }
  getCurrentSlot(): string {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) return 'AM';
    if (hour >= 12 && hour < 18) return 'PM';
    return 'Night';
  }
 loadMiniMaps() {

  setTimeout(() => {

    this.forecastData.forEach((day, i) => {

      const mapId = 'miniMap' + i;
      const element = document.getElementById(mapId);

      if (!element) return;

      // 🔥 IMPORTANT: clear old map
      element.innerHTML = '';

      try {

        const map = L.map(element, {
          attributionControl: false,
          zoomControl: false,
          dragging: false,
          scrollWheelZoom: false
        }).setView(
          [this.weatherData.latitude, this.weatherData.longitude],
          8
        );

        // ✅ tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
          .addTo(map);

        // ✅ marker
        L.marker([
          this.weatherData.latitude,
          this.weatherData.longitude
        ]).addTo(map);

      } catch (e) {
        console.log('Map load error:', e);
      }

    });
     
  }, 500); // 🔥 thodu delay vadharyu
}
}