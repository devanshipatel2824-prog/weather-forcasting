import { Component, ChangeDetectorRef, TrackByFunction, ElementRef, ViewChild, HostListener } from '@angular/core';
import { WeatherService } from '../../firebase-service/weather-service';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { UserFooter } from '../user-footer/user-footer';
import { UserHeader } from '../user-header/user-header';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-weather-forcast',
  standalone: true,
  imports: [CommonModule, UserFooter, UserHeader, FormsModule, RouterModule],
  templateUrl: './weather-forcast.html',
  styleUrl: './weather-forcast.css',
})
export class WeatherForcast {

  @HostListener('document:click', ['$event'])
  mapVisible = false;
  selectedForecast: any = null
  weatherData: any = {};
  forecastData: any[] = [];
  nearestStations: any[] = [];
  nearestStationsDetailed: any[] = [];
  map: any;
  mainMarker: any;
  stationMarkers: any[] = [];
  slot: any;
  nearestCity: string = '';
  searchedCity: any;
  currentHour: number = 0;
  activeTab: string = 'temp';   // temp = overview
  viewMode: string = 'chart';   // chart | list
  hourlyData: any;
  selectedDayIndex: any;
  city: string = 'Valsad';   // 👈 default location
  suggestions: any[] = [];
  forecastDays: any[] = [];
  selectedDayHours: any[] = [];

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chart: any;
  API_KEY: string = '685efac5e35847415ea935663a61e193';

  // getDirection: any;


  constructor(
    private weatherService: WeatherService,
    private cdr: ChangeDetectorRef,
    private router: Router, // ✅ Router injected
    private http: HttpClient
  ) { }

  updateCityTime(timezoneOffset: number) {
    const nowUTC = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);

    const cityTime = new Date(nowUTC + (timezoneOffset * 1000));

    this.currentTime = cityTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  searchWeather() {
    if (!this.city) return;

    this.weatherService.getWeather(this.city).subscribe(data => {
      //  console.log("API RESPONSE 👉", data);
      this.getHourlyForecast(this.city);

      this.updateCityTime(data.timezone);
      this.weatherData = {
        name: data.city || '-',

        temperature: Math.round(data.temperature || 0),

        feels_like: Math.round(data.temperature || 0), // (optional same for now)

        temp_max: Math.round(data.temperature || 0),
        temp_min: Math.round(data.temperature || 0),

        humidity: data.humidity || 0,

        wind: Math.round((data.windSpeed || 0) * 3.6),

        pressure: 0, // (API ma nathi, pachi add kari shakay)

        visibility: 0, // (API ma nathi)

        condition: data.description || 'Clear',

        latitude: data.latitude || 0,
        longitude: data.longitude || 0
      };
      this.activeTab = 'temp';
      this.viewMode = 'chart';
      // ✅ call once (duplicate remove)
      this.getNearbyStationsDetailed(this.weatherData.latitude, this.weatherData.longitude);

      this.nearestCity = data.name;
      this.mapVisible = true;
      this.cdr.detectChanges();

      setTimeout(() => this.initMap(this.weatherData.latitude, this.weatherData.longitude), 100);

      // ✅ DETAILED FORECAST
      this.weatherService.getDetailedForecast(this.city)
        .subscribe((res: any) => {
          // 🔥 HOURLY DATA (chart + list mate)
          this.hourlyData = res.list.map((item: any) => ({
            fullDate: item.dt_txt,
            time: new Date(item.dt_txt).toLocaleTimeString([], {
              hour: 'numeric'
            }),
            temp: Math.round(item.main.temp),
            humidity: item.main.humidity,
            wind: Math.round(item.wind.speed * 3.6),
            clouds: item.clouds?.all ?? 0,
            rain: item.rain?.['3h'] ?? 0,
            hour: new Date(item.dt_txt).getHours(),
            condition: item.weather[0]?.description || 'Clear'
          }));
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

              clouds: item.clouds?.all ?? 0,
              rain: item.rain?.['3h'] ?? 0,

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
          this.selectedDayIndex = 0;
          this.cdr.detectChanges();

        });

      // this.getNearbyStationsDetailed(data.latitude, data.longitude);
    });
  }

  currentTime = '';

  ngOnInit() {
    this.getUserLocationWeather();

    // fallback
    setTimeout(() => {
      if (!this.weatherData || !this.weatherData.name) {
        this.city = 'Valsad';
        this.searchWeather();
      }
    }, 3000);
  }
  onSearchChange() {

    if (!this.city || this.city.length < 2) {
      this.suggestions = [];
      return;
    }

    this.http.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${this.city}&limit=5&appid=${this.API_KEY}`
    ).subscribe((res: any) => {

      this.suggestions = res.map((item: any) => ({
        name: item.name,
        country: item.country,
        lat: item.lat,
        lon: item.lon
      }));

    });
  }
  selectCity(cityName: string) {

    this.city = cityName;
    this.suggestions = [];

    this.searchWeather(); // 🔥 direct weather load
  }

  onClickOutside(event: any) {
    if (!event.target.closest('.search-box')) {
      this.suggestions = [];
    }
  }
 initMap(lat: number, lon: number) {
  if (this.map) this.map.remove();

  this.map = L.map('map').setView([lat, lon], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    .addTo(this.map);

  // 🔥 CUSTOM ICON
  const customIcon = L.icon({
    iconUrl: 'location.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  // 🔥 APPLY ICON
  this.mainMarker = L.marker([lat, lon], { icon: customIcon })
    .addTo(this.map)
    .bindPopup(`
      <b>${this.city}</b><br>
      🌡 ${this.weatherData.temperature}°C
    `)
    .openPopup();
}


  getChartPoints(): string {

    const slots = this.forecastData[this.selectedDayIndex]?.slots || [];

    return slots.map((s: any, i: number) => {

      let value = 0;

      switch (this.activeTab) {
        case 'temp': value = s.temp; break;
        case 'wind': value = s.wind; break;
        case 'humidity': value = s.humidity; break;
        case 'rain': value = s.humidity; break;
        case 'clouds': value = s.humidity; break;
      }

      return {
        x: i * 80,
        y: 200 - (value * 3)   // adjust scale
      };

    }).map((p: { x: number, y: number }) => `${p.x},${p.y}`).join(' ');
  }
  setTab(tab: string) {
    this.activeTab = tab;
  }

  setView(mode: string) {
    this.viewMode = mode;
  }

  trackByIndex(index: number) {
    return index;
  }


  createChart() {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    // 🔥 GRADIENT (MSN style)
    const gradient = ctx.createLinearGradient(0, 0, 0, 350);
    gradient.addColorStop(0, 'rgba(255, 120, 120, 0.6)');
    gradient.addColorStop(1, 'rgba(30, 40, 70, 0.1)');

    const data = this.getSelectedDayHourly();

    const labels = data.map((d: any) => d.time);
    const values = data.map((d: any) => this.getValue(d));

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          fill: true,
          backgroundColor: gradient,   // 🔥 MAIN
          borderColor: '#4dabf7',
          tension: 0.4,               // 🔥 smooth curve
          pointRadius: 3,
          pointBackgroundColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: { color: '#ccc' },
            grid: { color: 'rgba(255,255,255,0.05)' }
          },
          y: {
            ticks: { color: '#ccc' },
            grid: { color: 'rgba(255,255,255,0.05)' }
          }
        }
      }
    });
  }
  getSelectedDayHourly() {
    if (!this.hourlyData || this.selectedDayIndex == null) return [];

    const selectedDate = new Date(this.forecastData[this.selectedDayIndex].date)
      .toDateString();

    return this.hourlyData.filter((h: any) => {
      const d = new Date(h.fullDate).toDateString();
      return d === selectedDate;
    });
  }

  getValue(item: any) {
    switch (this.activeTab) {
      case 'temp':
        return item.temp;

      case 'humidity':
        return item.humidity;

      case 'wind':
        return item.wind;

      case 'clouds':
        return item.clouds;

      case 'rain':
        return item.rain;

      default:
        return item.temp;
    }
  }
  getDayValue(slots: any[]): number {

    switch (this.activeTab) {

      case 'temp':
        return Math.round(
          slots.reduce((sum, s) => sum + (s.temp || 0), 0) / slots.length
        );

      case 'wind':
        return Math.round(
          slots.reduce((sum, s) => sum + (s.wind || 0), 0) / slots.length
        );

      case 'humidity':
        return Math.round(
          slots.reduce((sum, s) => sum + (s.humidity || 0), 0) / slots.length
        );

      case 'rain':
        return Math.round(
          slots.reduce((sum, s) => sum + (s.humidity || 0), 0) / slots.length
        );

      case 'clouds':
        return Math.round(
          slots.reduce((sum, s) => sum + (s.humidity || 0), 0) / slots.length
        );

      default:
        return 0;
    }
  }
  getMaxValue(): number {
    const slots = this.forecastData[this.selectedDayIndex]?.slots || [];

    return Math.max(...slots.map((s: any) => {
      switch (this.activeTab) {
        case 'temp': return s.temp;
        case 'wind': return s.wind;
        case 'humidity': return s.humidity;
        default: return s.temp;
      }
    }), 10);
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


  openStationMap(station: any, layer: string) {
    this.router.navigate(['/station-map'], {
      queryParams: {
        lat: station.coord.lat,
        lon: station.coord.lon,
        name: station.name,
        temp: station.main.temp,
        wind: station.wind.speed,
        pressure: station.main.pressure
      }
    });
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


  getNearbyStationsDetailed(lat: number, lon: number) {
    this.nearestStationsDetailed = [];

    fetch(`https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=15&appid=685efac5e35847415ea935663a61e193&units=metric`)
      .then(res => res.json())
      .then(res => {
        let stations = res.list.filter((st: any) => st.name && st.coord && st.main);
        stations.sort((a: any, b: any) => this.getDistance(lat, lon, a.coord.lat, a.coord.lon) - this.getDistance(lat, lon, b.coord.lat, b.coord.lon));
        stations = stations.slice(1, 6); // top 5 nearest

        stations.forEach((st: any) => {
          const distance = this.getDistance(lat, lon, st.coord.lat, st.coord.lon);
          const distanceDetail = `${(distance * 0.621).toFixed(1)} miles ${this.getDirections(lat, lon, st.coord.lat, st.coord.lon)}`;

          // ✅ Add marker only if map exists
          if (this.map) {
            const marker = L.circleMarker([st.coord.lat, st.coord.lon], {
              radius: 7,
              color: '#ff6b6b',
              fillColor: '#ff6b6b',
              fillOpacity: 0.8
            }).addTo(this.map);
            this.stationMarkers.push(marker);
          }

          this.nearestStationsDetailed.push({
            name: st.name,
            temp: Math.round(st.main.temp),
            wind: Math.round(st.wind?.speed || 0),
            clouds: st.clouds?.all ?? 0,
            visibility: st.visibility ?? 0,
            conditionLine: st.weather[0]?.main + ' – ' + (st.weather[0]?.description || 'Clear'),
            iconUrl: st.weather[0]?.icon
              ? `https://openweathermap.org/img/wn/${st.weather[0].icon}@2x.png`
              : 'assets/default-weather.png',
            distance: distance.toFixed(1),
            distanceDetail,
            altitude: st.main?.grnd_level ?? 0,
            updatedAgo: '1 hour ago'
          });
        });

        this.cdr.detectChanges();
      });
  }
  getDirections(lat1: number, lon1: number, lat2: number, lon2: number): string {
    const dy = lat2 - lat1;
    const dx = lon2 - lon1;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    if (angle >= -22.5 && angle < 22.5) return '→ E';
    if (angle >= 22.5 && angle < 67.5) return '↗ NE';
    if (angle >= 67.5 && angle < 112.5) return '↑ N';
    if (angle >= 112.5 && angle < 157.5) return '↖ NW';
    if (angle >= 157.5 || angle < -157.5) return '← W';
    if (angle >= -157.5 && angle < -112.5) return '↙ SW';
    if (angle >= -112.5 && angle < -67.5) return '↓ S';
    if (angle >= -67.5 && angle < -22.5) return '↘ SE';
    return '';
  }




  getHourlyForecast(city: string) {

    this.http.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.API_KEY}&units=metric`)
      .subscribe((res: any) => {

        const grouped: any = {};

        res.list.forEach((item: any) => {

          const date = item.dt_txt.split(' ')[0];

          if (!grouped[date]) grouped[date] = [];

          grouped[date].push({
            time: new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temp: Math.round(item.main.temp),

            condition: item.weather[0].main,

            // 🔥 ADD THIS
            icon: item.weather[0].icon,

            rain: item.pop ? Math.round(item.pop * 100) : 0,
            wind: Math.round(item.wind.speed * 3.6),
            humidity: item.main.humidity,
            feels: Math.round(item.main.feels_like),
            pressure: item.main.pressure,
            visibility: Math.round(item.visibility / 1000),
            gust: item.wind.gust || 0,
            open: false
          });
        });

        // ✅ 🔥 AA NAVO CODE AHI MUKVANO CHE
        const today = new Date();
        const days: any[] = [];

        for (let i = 0; i < 7; i++) {

          const d = new Date();
          d.setDate(today.getDate() + i);

          const dateStr = d.toISOString().split('T')[0];

          const dayData = grouped[dateStr] || [];

          days.push({
            date: dateStr,
            label: i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
            dayDate: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
            temp_max: dayData.length
              ? Math.max(...dayData.map((h: any) => h.temp))
              : '-',
            hours: dayData.length ? dayData : null
          });
        }

        this.forecastDays = days;

        // ✅ IMPORTANT (error avoid mate)
        setTimeout(() => {
          this.selectDay(0);
        }, 0);

      });
  }
  getUserLocationWeather() {
    navigator.geolocation.getCurrentPosition((position) => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      this.http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`)
        .subscribe((data: any) => {

          this.city = data.name;   // 👈 auto city set
          this.searchWeather();    // 👈 load full data

        });

    });
  }
  selectDay(index: number) {
    this.selectedDayIndex = index;
    this.selectedDayHours = this.forecastDays[index].hours;
  }

  toggleRow(i: number) {
    this.selectedDayHours[i].open = !this.selectedDayHours[i].open;
  }
}