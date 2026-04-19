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
  lat = 28.6   // Delhi
  lon = 77.2
  name: string = '';
  map: any;
  overlayLayer: any;

  sideMaps: any[] = [];
  selectedMap: any;
  miniMaps: any = {}; // store all mini maps
  apiKey = '685efac5e35847415ea935663a61e193';
  temp: any;
  pressure: any;
  wind: any;


  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      this.lat = +params['lat'] || 28.6;
      this.lon = +params['lon'] || 77.2;
      this.name = params['name'];
      this.temp = params['temp'];
      this.wind = params['wind'];
      this.pressure = params['pressure'];

      const layer = params['layer'] ? String(params['layer']) : 'temp';

      this.sideMaps = [
        { icon: '🌡️', title: 'Temperature', layer: 'temp' },   // ✅ Red heat map
        { icon: '💨', title: 'Wind', layer: 'wind' },          // ✅ Wind animation
        { icon: '🌪️', title: 'Pressure', layer: 'pressure' }   // ✅ Pressure lines
      ];

      // ✅ FIX: delay windy
      setTimeout(() => {
        this.initWindyMap(layer);
      }, 300);

      // ✅ mini maps
      setTimeout(() => {
        this.loadMiniMaps();
      }, 1200);

    });

  }

 initWindyMap(layer: string = 'temp') {

  const safeLayers = ['temp', 'wind', 'pressure'];

  if (!safeLayers.includes(layer)) {
    layer = 'temp';
  }

  const options = {
    key: 'oHFoqfAM2orYUEil4A4RyXQxpYZSbnOQ',
    lat: this.lat,
    lon: this.lon,
    zoom: 6,
    overlay: layer,
    container: 'windy'
  };

  (window as any).windyInit(options, (windyAPI: any) => {

    this.map = windyAPI.map;
    (window as any).windyAPI = windyAPI;

    this.selectedMap = this.sideMaps.find(m => m.layer === layer);

    // ✅ only overlay
    windyAPI.store.set('overlay', layer);

    // ✅ focus location
    // ✅ focus location
  this.map.setView([this.lat, this.lon], 10);

  // ✅ CUSTOM ICON ADD 👇
  const customIcon = L.icon({
    iconUrl: '/location.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  L.marker([this.lat, this.lon], { icon: customIcon })
    .addTo(this.map)
    .bindPopup(this.name)
    .openPopup();


  });
}

  // 🔥 CHANGE MAP TYPE
  selectSideMap(map: any) {

  this.selectedMap = map;

  const windyAPI = (window as any).windyAPI;
  if (!windyAPI) return;

  try {
    // ✅ ONLY THIS (no animate)
    windyAPI.store.set('overlay', map.layer);

  } catch (e) {
    console.log('❌ fallback');
    windyAPI.store.set('overlay', 'temp');
  }
}

  currentDateTime(): string {
    const now = new Date();
    return now.toLocaleString();
  }
  getPreviewMap(layer: string): string {

    const layerMap: any = {
      temp: 'temp_new',
      wind: 'wind_new',
      pressure: 'pressure_new'

    };

    const mappedLayer = layerMap[layer];

    if (!mappedLayer) return '';

    const z = 2;

    const x = Math.floor((this.lon + 180) / 360 * Math.pow(2, z));
    const y = Math.floor(
      (1 - Math.log(Math.tan(this.lat * Math.PI / 180) + 1 / Math.cos(this.lat * Math.PI / 180)) / Math.PI)
      / 2 * Math.pow(2, z)
    );

    return `https://tile.openweathermap.org/map/${mappedLayer}/${z}/${x}/${y}.png?appid=${this.apiKey}`;
  }
  loadMiniMaps() {

    const layerMap: any = {
      temp: 'temp_new',
      wind: 'wind_new',
      pressure: 'pressure_new'    // ✅ ADD
    };

    this.sideMaps.forEach(mapItem => {

      const id = 'mini-map-' + mapItem.layer;

      if (this.miniMaps[mapItem.layer]) return;

      const miniMap = L.map(id, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false
      }).setView([this.lat, this.lon], 5);

      // base map
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(miniMap);

      // ✅ correct overlay
      L.tileLayer(
        `https://tile.openweathermap.org/map/${layerMap[mapItem.layer]}/{z}/{x}/{y}.png?appid=${this.apiKey}`,
        { opacity: 0.8 }
      ).addTo(miniMap);

      this.miniMaps[mapItem.layer] = miniMap;

    });
  }
  animateLayer() {

    let i = 0;

    setInterval(() => {

      // this.map.removeLayer(this.overlayLayer);

      const layerName = `temp_new`; // same but fake animation

      this.overlayLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/${layerName}/{z}/{x}/{y}.png?appid=${this.apiKey}`,
        { opacity: 0.7 }
      ).addTo(this.map);

      i++;

    }, 1000);

  }

}