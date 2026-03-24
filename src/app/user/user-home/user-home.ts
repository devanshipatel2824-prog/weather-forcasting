import { Component } from '@angular/core';
import { UserHeader } from "../user-header/user-header";
import { UserFooter } from "../user-footer/user-footer";
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-home',
  imports: [UserHeader, UserFooter,CommonModule],
  templateUrl: './user-home.html',
  styleUrl: './user-home.css',
})
export class UserHome {
weatherData: any;
currentTime = new Date();

  iconUrl: string = '';

  API_KEY = '685efac5e35847415ea935663a61e193';
  getLocationWeather: any;


  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getWeather();
  }

 getWeather() {
  const city = 'Valsad';

  this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.API_KEY}&units=metric`)
    .subscribe((data: any) => {

      console.log("API DATA 👉", data); // 👈 IMPORTANT

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
