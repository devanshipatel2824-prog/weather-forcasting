import { Component, OnInit } from '@angular/core';
import { WeatherData } from '../../interface/weather-data';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from "../sidebar/sidebar";

@Component({
  selector: 'app-manage-weather-data',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './manage-weather-data.html',
  styleUrl: './manage-weather-data.css',
})
export class ManageWeatherData implements OnInit {
  weatherData: WeatherData[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.firebaseService.getAllWeatherData().subscribe(data => {
      this.weatherData = data;
    });
  }

  deleteData(weatherId: string) {
    this.firebaseService.deleteWeatherData(weatherId).then(() => this.loadAllData());
  }
}
