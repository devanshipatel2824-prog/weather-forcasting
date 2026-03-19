import { Component, OnInit } from '@angular/core';
import { UserHeader } from "../user-header/user-header";
import L from 'leaflet';
import { WeatherService } from '../../firebase-service/weather-service';
import { FirebaseService } from '../../firebase-service/firebase-service';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
});

@Component({
  selector: 'app-maps',
  imports: [UserHeader],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Maps implements OnInit{
  map: any;
  

  constructor(
    private weatherService: WeatherService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {

    // 🌍 Map initialize
    this.map = L.map('map').setView([20.5937, 78.9629], 5);

    // 🗺️ Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // 📍 Default Marker
    L.marker([20.5937, 78.9629])
      .addTo(this.map)
      .bindPopup('India Center')
      .openPopup();

    // 🔥 CLICK EVENT (IMPORTANT)
    this.map.on('click', (e: any) => {

      const lat = e.latlng.lat;
      const lon = e.latlng.lng;

      this.weatherService.getWeatherByCoords(lat, lon)
        .subscribe((data) => {

          // 🔥 Firebase ma save
          this.firebaseService.addHistory(data.city);

          // 🌦️ Popup show
          L.popup()
            .setLatLng([lat, lon])
            .setContent(`
              <b>${data.city}</b><br>
              🌡 Temp: ${data.temperature}°C<br>
              💧 Humidity: ${data.humidity}%<br>
              🌬 Wind: ${data.windSpeed} m/s<br>
              ☁ ${data.description}
            `)
            .openOn(this.map);

        });

    });

  }
  
  
}
