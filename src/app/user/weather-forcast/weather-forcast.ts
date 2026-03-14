import { Component } from '@angular/core';
import { WeatherService } from '../../firebase-service/weather-service';
import { ForecastData } from '../../interface/weather-forcast';
import { UserFooter } from "../user-footer/user-footer";
import { UserHeader } from "../user-header/user-header";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-weather-forcast',
  imports: [UserFooter, UserHeader, CommonModule, FormsModule],
  templateUrl: './weather-forcast.html',
  styleUrl: './weather-forcast.css',
})
export class WeatherForcast {
  city = ''

  forecastData: ForecastData[] = []

  constructor(private weatherService: WeatherService) { }

  searchForecast() {

    if (!this.city) return

    this.weatherService.getForecast(this.city).subscribe({

      next: (data) => {

        console.log("Forecast Data:", data)   // 👈 check this

        this.forecastData = data

      },

      error: (err) => {
        console.error("Forecast Error:", err)
      }

    })

  }
}
