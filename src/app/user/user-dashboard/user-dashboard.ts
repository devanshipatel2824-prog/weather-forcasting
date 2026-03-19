import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../firebase-service/weather-service';
import { WeatherData } from '../../interface/weather';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoriteCity } from '../../interface/favorite';
import { SearchHistory } from '../../interface/history';
// import { WeatherAlert } from '../../interface/alert';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { UserHeader } from "../user-header/user-header";
import { UserFooter } from "../user-footer/user-footer";

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, UserHeader, UserFooter],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard  {

  stations: any[] = [];
weather: any[] = [];
constructor(
    private firebaseService: FirebaseService,
    // private cdr: ChangeDetectorRef
  ) {}
async ngOnInit() {
  this.stations = await this.firebaseService.getStations();
  // this.weather = await this.firebaseService.getAllWeatherData();
}
}