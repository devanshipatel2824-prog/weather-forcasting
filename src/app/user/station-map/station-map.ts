import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import L from 'leaflet';

@Component({
  selector: 'app-station-map',
  imports: [CommonModule],
  templateUrl: './station-map.html',
  styleUrl: './station-map.css',
})
export class StationMap {
 lat: number = 0;
  lon: number = 0;
  name: string = '';
  map: any;
  overlayLayer: any;

  sideMaps: any[] = [];
  selectedMap: any;

  apiKey = '685efac5e35847415ea935663a61e193';

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.lat = +params['lat'];
      this.lon = +params['lon'];
      this.name = params['name'];

      this.initMap();

      // side maps
      this.sideMaps = [
        { icon: '🌡️', title: 'Temperature', layer: 'temp_new' },
        { icon: '☁️', title: 'Clouds', layer: 'clouds_new' },
        { icon: '🌧️', title: 'Rain', layer: 'precipitation_new' },
        { icon: '💨', title: 'Wind', layer: 'wind_new' }
      ];

      this.selectSideMap(this.sideMaps[0]); // default

      this.cdr.detectChanges();
    });

  }

  // 🔥 INIT MAP
  initMap() {
    if (this.map) this.map.remove();

    this.map = L.map('station-map-container')
      .setView([this.lat, this.lon], 8);

    // base map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      .addTo(this.map);

    // marker
    L.marker([this.lat, this.lon])
      .addTo(this.map)
      .bindPopup(`<b>${this.name}</b>`)
      .openPopup();
  }

  // 🔥 CHANGE MAP TYPE
  selectSideMap(map: any) {

    this.selectedMap = map;

    // remove old overlay
    if (this.overlayLayer) {
      this.map.removeLayer(this.overlayLayer);
    }

    // add new weather layer
    this.overlayLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/${map.layer}/{z}/{x}/{y}.png?appid=${this.apiKey}`,
      { opacity: 0.6 }
    ).addTo(this.map);

  }

  currentDateTime(): string {
    const now = new Date();
    return now.toLocaleString();
  }

}
