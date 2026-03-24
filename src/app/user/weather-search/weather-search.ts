import { AfterViewInit, ChangeDetectorRef, Component, HostListener, NgZone, OnInit } from '@angular/core';
import { WeatherService } from '../../firebase-service/weather-service';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserHeader } from "../user-header/user-header";
import { UserFooter } from "../user-footer/user-footer";
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
import 'leaflet-velocity';
import 'leaflet.heat';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'layers.jpg',
  iconUrl: 'location.png',
  shadowUrl: 'marker-shadow.jpg'
});

@Component({
  selector: 'app-weather-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather-search.html',
  styleUrl: './weather-search.css',
})
export class WeatherSearch implements AfterViewInit, OnInit {

  map: any;
  marker: any;
  currentLayer: any;
  baseLayer: any;
  timeIndex = 0;
  forecastData: any[] = [];
  weatherData?: any;
  city = '';

  menuOpen = false;
  selectedLayer = 'temp';
  isSearchOpen = false;
  labelsLayer: L.TileLayer | undefined;


  constructor(
    private weatherService: WeatherService,
    private firebaseService: FirebaseService,
    private zone: NgZone,  // 🔥 ADD THIS
    private cd: ChangeDetectorRef
  ) { }

  // ❌ REMOVE document.addEventListener (BUG FIX)
  ngOnInit() { }

  ngAfterViewInit() {

    this.map = L.map('map').setView([22.9734, 78.6569], 5);

    // 🌍 Satellite Base
    this.baseLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles © Esri'
      }
    ).addTo(this.map);

    // 🏷 Labels Overlay (IMPORTANT)
    this.labelsLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
      {

        opacity: 0.9,
        maxZoom: 19
      }
    ).addTo(this.map);

    // MAP CLICK EVENT
    this.map.on('click', (e: any) => {

      const lat = e.latlng.lat;
      const lon = e.latlng.lng;

      // 🔥 INSTANT POPUP
      const popup = L.popup({
        className: 'weather-popup',
        closeButton: false,
        offset: [0, -10]
      })
        .setLatLng([lat, lon])
        .setContent(`<div class="popup-loading">Loading...</div>`)
        .openOn(this.map);

      // 🔥 BLINK MARKER
      this.addBlinkMarker(lat, lon);

      // 🔥 WEATHER DIRECT (NO CITY API)
      this.weatherService.getWeatherByCoords(lat, lon)
        .subscribe((data: any) => {

          let extraInfo = '';

          switch (this.selectedLayer) {
            case 'temp':
              extraInfo = `🌡 Temp: ${data.temperature}°C`;
              break;
            case 'humidity':
              extraInfo = `💧 Humidity: ${data.humidity}%`;
              break;
            case 'wind':
              extraInfo = `🌬 Wind: ${data.windSpeed} m/s`;
              break;
            case 'pressure':
              extraInfo = `🌍 Pressure: ${data.pressure || 'N/A'} hPa`;
              break;
            case 'clouds':
              extraInfo = `☁ ${data.description}`;
              break;
            default:
              extraInfo = `🌡 Temp: ${data.temperature}°C`;
          }

          // 🔥 UPDATE POPUP FAST
          popup.setContent(`
        <b>${data.city || 'Location'}</b><br>
        ${extraInfo}
      `);

          // 👉 forecast
          this.weatherService.getWeatherByCoords(lat, lon)
            .subscribe({
              next: (data: any) => {

                let extraInfo = `🌡 Temp: ${data.temperature}°C`;

                popup.setContent(`
        <b>${data.city || 'Location'}</b><br>
        ${extraInfo}
      `);

                const cityName = data.city ? data.city : 'Location';

this.weatherService.getForecast(cityName)
  .subscribe({
    next: (forecast: any[]) => {

      let forecastHTML = '';

forecast.forEach((f: any, index: number) => {

  const barWidth = Math.min((f.temperature + 10) * 3, 100);

  forecastHTML += `
    <div class="popup-row ${index === 0 ? 'active' : ''}">
      <span>${index === 0 ? 'Today' : f.date}</span>
      <span class="temp">${Math.round(f.temperature)}°</span>

      <div class="bar">
        <div style="width:${barWidth}%"></div>
      </div>
    </div>
  `;
});

     popup.setContent(`
<div class="popup-box">

  <div class="popup-header">
    <span>★ ${cityName}</span>
  </div>

  <div class="popup-top">
    <div>
      <p>DAILY FORECAST</p>
      <span>UTC+5.5</span>
    </div>
    <div>
      <p>WIND</p>
      <span>km/h</span>
    </div>
  </div>

  ${forecastHTML}

</div>
`);
    },
                    error: () => {
                      popup.setContent(`
              <b>${cityName}</b><br>
              ${extraInfo}<br>
              ⚠ Forecast not available
            `);
                    }
                  });

              },

              error: () => {
                popup.setContent(`
        <b>Error loading data</b><br>
        Please try again
      `);
              }
            });

        });

    });
  }
  getCityName(lat: number, lon: number): Promise<any> {
    return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
      .then(res => res.json());
  }



  // ============================
  // 📍 SHOW LOCATION
  // ============================
  showLocation(lat: number, lon: number, city?: string) {

    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.marker([lat, lon]).addTo(this.map);

    // 👉 City label (permanent)
    this.zone.run(() => {

      if (city) {
        this.marker.bindTooltip(city, {
          permanent: true,
          direction: 'top',
          className: 'city-label'
        }).openTooltip();
      }

    });

    this.map.setView([lat, lon], 8);
  }

  // ============================
  // 🌦 CHANGE MAP LAYER
  // ============================
  setLayer(type: string) {

    this.selectedLayer = type;

    // 🔥 REMOVE old layer
    if (this.currentLayer) {
      this.map.removeLayer(this.currentLayer);
    }

    // 🔥 STOP rain if switching
    if (type !== 'rain') {
      const canvas: any = document.getElementById('rain-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    const API_KEY = '685efac5e35847415ea935663a61e193';
    let url = '';

    switch (type) {

      // ☁ CLOUDS
      case 'clouds':
        url = `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`;

        this.currentLayer = L.tileLayer(url, {
          opacity: 0.8   // 👈 important
        }).addTo(this.map);
        break;

      // 🌧 RAIN
      case 'rain':
        url = `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`;
        this.startRain(); // 🌧 animation
        break;

      // 🌬 WIND (LIVE)
      case 'wind':

        fetch('https://api.open-meteo.com/v1/forecast?latitude=20&longitude=78&hourly=windspeed_10m,winddirection_10m')
          .then(res => res.json())
          .then(data => {

            const velocityLayer = (L as any).velocityLayer({
              displayValues: true,
              displayOptions: {
                velocityType: 'Wind',
                position: 'bottomleft',
              },
              data: data,
              maxVelocity: 15
            });

            this.currentLayer = velocityLayer;
            velocityLayer.addTo(this.map);
          });

        return;

      // 🌡 TEMP
      case 'temp':
        url = `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`;
        break;

      // 🔥 HEATMAP
      case 'heat':

        const heatData = [
          [22.97, 78.65, 0.8],
          [19.07, 72.87, 0.9],
          [28.61, 77.20, 0.7]
        ];

        this.currentLayer = (L as any).heatLayer(heatData, {
          radius: 40,
          blur: 30,
          gradient: {
            0.1: 'blue',
            0.3: 'cyan',
            0.5: 'green',
            0.7: 'yellow',
            1.0: 'red'
          }
        }).addTo(this.map);

        this.menuOpen = false;
        return;

      // 💧 HUMIDITY
      case 'humidity':
        url = `https://tile.openweathermap.org/map/humidity_new/{z}/{x}/{y}.png?appid=${API_KEY}`;
        break;

      // 🌍 PRESSURE
      case 'pressure':
        url = `https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${API_KEY}`;
        break;

      default:
        return;
    }

    // 🔥 ADD WEATHER TILE (MAIN FIX)
    if (url) {
      this.currentLayer = L.tileLayer(url, {
        opacity: 0.6
      }).addTo(this.map);
    }

    // 🔥 CLOSE MENU
    this.menuOpen = false;
  }

  // ============================
  // 📂 DROPDOWN MENU
  // ============================
  toggleMenu() {
    this.zone.run(() => {
      this.menuOpen = !this.menuOpen;
      this.cd.detectChanges();
      console.log('MENU:', this.menuOpen);
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.sidebar') && !target.closest('.menu-btn')) {
      this.menuOpen = false;
    }
  }

  // ============================
  // 🔍 SEARCH
  // ============================
  searchWeather() {

    if (!this.city) return;

    this.weatherService.getWeather(this.city).subscribe((data: any) => {

      this.weatherData = data;

      this.firebaseService.addHistory(this.city);

      this.showLocation(data.latitude, data.longitude, data.city);

      this.weatherService.getForecast(this.city)
        .subscribe(data => {
          this.forecastData = data;
        });
    });
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  // ============================
  // ⭐ FAVORITE
  // ============================
  addFavorite() {

    if (!this.weatherData) return;

    this.firebaseService.addFavorite(this.weatherData.city);
    alert('Added to favorite');
  }

  // ============================
  // 📍 USER LOCATION
  // ============================
  getUserLocation() {

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition((position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        this.map.setView([lat, lon], 8);

        this.weatherService.getWeatherByCoords(lat, lon)
          .subscribe((data: any) => {

            this.weatherData = data;
            this.showLocation(lat, lon);

          });

      });

    } else {
      alert('Geolocation not supported');
    }
  }

  // ============================
  // ⏱ SLIDER
  // ============================
  changeTime() {

    if (this.forecastData.length > 0) {
      const data = this.forecastData[this.timeIndex];
      this.weatherData = data;
    }
  }
  startRain() {
    const canvas: any = document.getElementById('rain-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = this.map.getSize().x;
    canvas.height = this.map.getSize().y;

    const drops: any[] = [];

    for (let i = 0; i < 100; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20,
        speed: Math.random() * 5 + 5
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(174,194,224,0.5)';
      ctx.lineWidth = 1;

      drops.forEach(d => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        if (d.y > canvas.height) d.y = 0;
      });

      requestAnimationFrame(draw);
    };

    draw();
  }


  // colour chnage

  addTemperatureLayer() {
    const canvasLayer = (L as any).canvasLayer().delegate({
      onDrawLayer: (info: any) => {
        const ctx = info.canvas.getContext('2d');

        ctx.clearRect(0, 0, info.canvas.width, info.canvas.height);

        // Example gradient (fake data demo)
        const gradient = ctx.createLinearGradient(0, 0, info.canvas.width, 0);
        gradient.addColorStop(0, 'blue');
        gradient.addColorStop(0.5, 'green');
        gradient.addColorStop(1, 'red');

        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.4;
        ctx.fillRect(0, 0, info.canvas.width, info.canvas.height);
      }
    });

    canvasLayer.addTo(this.map);
  }


  //Dot marker
  addBlinkMarker(lat: number, lon: number) {

    const blinkingIcon = L.divIcon({
      className: 'blink-marker',
      html: '<div class="dot"></div>',
      iconSize: [20, 20]
    });

    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.marker([lat, lon], { icon: blinkingIcon }).addTo(this.map);
  }
}