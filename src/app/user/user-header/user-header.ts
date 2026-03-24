import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../interface/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-header',
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './user-header.html',
  styleUrl: './user-header.css',
})
export class UserHeader {
isScrolled=false;
searchCity: string = '';
  http: any;
suggestions: any[] = [];

@HostListener('window:scroll',[])
onScroll(){
this.isScrolled=window.scrollY>50;
}
 loggedInUser: User | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const user = localStorage.getItem('loggedInUser');
    if (user) this.loggedInUser = JSON.parse(user);
  }

  logout() {
    localStorage.removeItem('loggedInUser');
    this.loggedInUser = null;
    this.router.navigate(['/user/user-login']);
  }



API_KEY = '685efac5e35847415ea935663a61e193';




// 🔍 LIVE SEARCH (autocomplete)
onSearchChange() {
  if (this.searchCity.length < 2) {
    this.suggestions = [];
    return;
  }

  this.http.get(`http://api.openweathermap.org/geo/1.0/direct?q=${this.searchCity}&limit=5&appid=${this.API_KEY}`)
    .subscribe((data:any) => {
      this.suggestions = data;
    });
}


// ✅ SELECT FROM DROPDOWN
selectCity(place: any) {
  this.searchCity = place.name;
  this.suggestions = [];

  this.router.navigate(['/user/weather-search'], {
    queryParams: {
      lat: place.lat,
      lon: place.lon
    }
  });
}


// 🔍 BUTTON SEARCH (fallback)
searchWeather() {
  if (!this.searchCity) return;

  this.router.navigate(['/user/weather-search'], {
    queryParams: { city: this.searchCity }
  });
}


}
