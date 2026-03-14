import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserDashboard } from "./user/user-dashboard/user-dashboard";
import { UserHome } from "./user/user-home/user-home";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('weather-forcasting-website');
}
