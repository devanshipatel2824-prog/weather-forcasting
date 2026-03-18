import { ChangeDetectorRef, Component } from '@angular/core';
import { WeatherStation } from '../../interface/weather-station';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from "../sidebar/sidebar";

@Component({
  selector: 'app-manage-weather-stations',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './manage-weather-stations.html',
  styleUrl: './manage-weather-stations.css',
})
export class ManageWeatherStations {
 stations: WeatherStation[] = [];
  station: any = {};   // 🔥 form data

  constructor(
    private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadStations();
  }

  loadStations() {
    this.firebaseService.getAllWeatherStations().subscribe(data => {
      this.stations = data;
      this.cdr.detectChanges();   // 🔥 UI refresh
    });
  }

  addStation() {
    this.firebaseService.addWeatherStation(this.station)
      .then(() => {
        alert("Station Added ✅");
        this.station = {};   // reset form
      })
      .catch(err => console.log(err));
  }
}
