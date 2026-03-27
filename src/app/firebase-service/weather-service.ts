import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { WeatherData } from '../interface/weather';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
 private apiKey = '685efac5e35847415ea935663a61e193';
  private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  // ✅ CITY SEARCH
  getWeather(city: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}?q=${city},IN&appid=${this.apiKey}&units=metric`
    ).pipe(
      map(res => ({
        city: res.name,
        temperature: res.main.temp,
        humidity: res.main.humidity,
        windSpeed: res.wind.speed,
        description: res.weather[0]?.description || '',
        icon: `https://openweathermap.org/img/wn/${res.weather[0]?.icon}@2x.png`,
        latitude: res.coord.lat,
        longitude: res.coord.lon
      }))
    );
  }

  // ✅ MAP CLICK (IMPORTANT FIX 🔥)
  getWeatherByCoords(lat: number, lon: number): Observable<any> {

    return this.http.get<any>(
      `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
    ).pipe(
      map(res => ({
        city: res.name,
        temperature: res.main.temp,
        humidity: res.main.humidity,
        windSpeed: res.wind.speed,
        description: res.weather[0]?.description || '',
        latitude: res.coord.lat,
        longitude: res.coord.lon
      }))
    );
  }

  // ✅ FORECAST
  getForecast(city: string): Observable<any[]> {

    return this.http.get<any>(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&appid=${this.apiKey}&units=metric`
    ).pipe(
      map(res => {

        const daily: any = {}

        res.list.forEach((item: any) => {

          const date = item.dt_txt.split(" ")[0]

          if (!daily[date]) {
            daily[date] = {
              date: new Date(date).toDateString(),
              temperature: item.main.temp,
              humidity: item.main.humidity,
              windSpeed: item.wind.speed,
              description: item.weather[0].description,
              icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
            }
          }

        })

        return Object.values(daily).slice(0, 5)

      })
    )
  }
getNearbyStations(lat: number, lon: number) {
  return this.http.get(
    `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=5&appid=${this.apiKey}&units=metric`
  );
}
getDetailedForecast(city: string): Observable<any> {
  return this.http.get(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&appid=${this.apiKey}&units=metric`
  );
}
}
