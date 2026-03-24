// import { Component } from '@angular/core';
// import { UserHeader } from "../user-header/user-header";
// import { WeatherService } from '../../firebase-service/weather-service';
// import { FirebaseService } from '../../firebase-service/firebase-service';
// import L from 'leaflet';
// import { WeatherData } from '../../interface/weather-data';
// import { ApiWeatherData } from '../../interface/weather';


// delete (L.Icon.Default.prototype as any)._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'assets/marker-icon-2x.png',
//   iconUrl: 'assets/marker-icon.png',
//   shadowUrl: 'assets/marker-shadow.png',
// });

// @Component({
//   selector: 'app-show',
//   imports: [UserHeader],
//   templateUrl: './show.html',
//   styleUrl: './show.css',
// })
// export class Show {
// map: any;

//   constructor(
//     private weatherService: WeatherService,
//     private firebaseService: FirebaseService
//   ) {}

//   ngAfterViewInit(): void {
//     this.initMap();
//   }

//   initMap() {
//     // 🌍 Map initialize
//     this.map = L.map('map').setView([20.5937, 78.9629], 5);

//     // 🗺️ Tile Layer
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '© OpenStreetMap contributors'
//     }).addTo(this.map);

//     // 📍 Default Marker
//     L.marker([20.5937, 78.9629])
//       .addTo(this.map)
//       .bindPopup('India Center')
//       .openPopup();

//     // 🔥 CLICK EVENT
//     this.map.on('click', (e: any) => {

//       const lat = e.latlng.lat;
//       const lon = e.latlng.lng;

//       this.weatherService.getWeatherByCoords(lat, lon)
//         .subscribe({
//   next: (data: ApiWeatherData) => {

//     this.firebaseService.addHistory(data.city);

//     L.popup()
//       .setLatLng([lat, lon])
//       .setContent(`
//         <b>${data.city}</b><br>
//         🌡 Temp: ${data.temperature}°C<br>
//         💧 Humidity: ${data.humidity}%<br>
//         🌬 Wind: ${data.windSpeed} m/s<br>
//         ☁ ${data.description}
//       `)
//       .openOn(this.map);

//   },
//   error: (err) => console.error(err)
// });
//     });
//   }
// }
