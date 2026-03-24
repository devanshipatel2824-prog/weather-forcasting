import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { CommonModule } from '@angular/common';
import { UserFooter } from "../user-footer/user-footer";
import { UserHeader } from "../user-header/user-header";

@Component({
  selector: 'app-station-detail',
  imports: [CommonModule, UserFooter, UserHeader,RouterLink],
  templateUrl: './station-detail.html',
  styleUrl: './station-detail.css',
})
export class StationDetail {
stationId: string = '';
  stationData: any;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.stationId = this.route.snapshot.paramMap.get('id') || '';

    this.firebaseService.getStationById(this.stationId).subscribe((data: any) => {
      this.stationData = data;
    });
  }
}
