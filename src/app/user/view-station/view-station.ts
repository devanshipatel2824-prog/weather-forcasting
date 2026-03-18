import { ChangeDetectorRef, Component } from '@angular/core';
import { WeatherStation } from '../../admin/weather-station/weather-station';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserFooter } from "../user-footer/user-footer";
import { UserHeader } from "../user-header/user-header";

@Component({
  selector: 'app-view-station',
  imports: [CommonModule, FormsModule, UserFooter, UserHeader],
  templateUrl: './view-station.html',
  styleUrl: './view-station.css',
})
export class ViewStation {

  stations: any[] = [];
  station: any = {};

  constructor(
    private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef,
    private router: Router

  ) { }

  ngOnInit() {
    this.loadStations();
  }

  loadStations() {
    this.firebaseService.getAllWeatherStations().subscribe(data => {
      this.stations = data;

      // 🔥 FORCE UI UPDATE
      this.cdr.detectChanges();
    });
  }
 viewWeather(id: string) {
  this.router.navigate(['/user/station-detail', id]);
}
}