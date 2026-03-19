import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { AdminSidebar } from "../admin-sidebar/admin-sidebar";

@Component({
  selector: 'app-weather-station',
  imports: [CommonModule, FormsModule, AdminSidebar],
  templateUrl: './weather-station.html',
  styleUrl: './weather-station.css',
})
export class WeatherStation {
  stations: any[] = [];
  station: any = {};  // 🔥 form data

  showModal = false;
  editStation: any = {};

  constructor(
    private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadStations();
  }
  // 🔷 LOAD DATA
  loadStations() {
    this.firebaseService.getAllWeatherStations().subscribe(data => {
      this.stations = data;
      this.cdr.detectChanges();
    });
  }
 addStation() {
  this.firebaseService.addWeatherStation(this.station)
    .then(() => {
      this.station = {};   // reset form
      // 🔥 auto refresh (already subscribe che)
    });
}

// 🔷 OPEN EDIT POPUP
openEdit(station: any) {
  this.editStation = { ...station }; // copy
  this.showModal = true;
 this.cdr.detectChanges();
}

// 🔷 CLOSE POPUP
closeModal() {
  this.showModal = false;
 this.cdr.detectChanges();
}

// 🔷 UPDATE
updateStation() {
  this.firebaseService.updateWeatherStation(
    this.editStation.id,
    this.editStation
  ).then(() => {
    this.showModal = false;
  });
 this.cdr.detectChanges();
}
}
