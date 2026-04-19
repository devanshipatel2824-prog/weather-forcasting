import { Component } from '@angular/core';
import { UserHeader } from "../user-header/user-header";
import { UserFooter } from "../user-footer/user-footer";
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-user-home',
  imports: [UserHeader, UserFooter,CommonModule,FormsModule],
  templateUrl: './user-home.html',
  styleUrl: './user-home.css',
})
export class UserHome {
weatherData: any;
currentTime = new Date();
searchText: string = '';
suggestions: any[] = [];
foreignWeather: any;     // Foreign

recentWeather: any[] = [];
  iconUrl: string = '';

  API_KEY = '685efac5e35847415ea935663a61e193';
  getLocationWeather: any;


  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getWeather();
             // current (Valsad)
  
  }
getLocalTime(timezone: string) {
  return new Date().toLocaleString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
getWeather() {

  // ✅ VALSAD
  this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=Valsad&appid=${this.API_KEY}&units=metric`)
    .subscribe((data: any) => {
      this.weatherData = data;
    });

  // ✅ FOREIGN (Example: London)
  this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${this.API_KEY}&units=metric`)
    .subscribe((data: any) => {
      this.foreignWeather = data;
    });

}
onSearch() {

  if (this.searchText.length < 2) {
    this.suggestions = [];
    return;
  }

  this.http.get(`https://api.openweathermap.org/geo/1.0/direct?q=${this.searchText}&limit=5&appid=${this.API_KEY}`)
    .subscribe((data: any) => {
      this.suggestions = data;
    });

}

searchCity() {

  // જો suggestions હોય → first select
  if (this.suggestions.length > 0) {
    this.selectCity(this.suggestions[0]);
    return;
  }

  // direct API call
  if (!this.searchText) return;

  this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.searchText}&appid=${this.API_KEY}&units=metric`)
    .subscribe((data: any) => {
      this.weatherData = data;
      this.suggestions = [];
    });

}
selectCity(city: any) {

  this.suggestions = [];
  this.searchText = city.name;

  this.http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${this.API_KEY}&units=metric`)
    .subscribe((data: any) => {
      this.weatherData = data;
    });

}
  // HUMIDITY ROTATION (0% → 0deg, 100% → 180deg)
get humidityRotate() {
  return (this.weatherData?.main?.humidity || 0) * 1.8;
}

// WIND DIRECTION
get windDeg() {
  return this.weatherData?.wind?.deg || 0;
}

// TEXT DIRECTION
get windDirection() {
  const deg = this.weatherData?.wind?.deg || 0;

  if (deg > 45 && deg <= 135) return 'E';
  if (deg > 135 && deg <= 225) return 'S';
  if (deg > 225 && deg <= 315) return 'W';
  return 'N';
}


}
