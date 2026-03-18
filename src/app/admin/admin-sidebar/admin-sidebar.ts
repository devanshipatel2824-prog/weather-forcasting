import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterLink],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {
  constructor(private router: Router) { }


  logout() {
    localStorage.clear()
    this.router.navigate(['/login'])
  }
  goDashboard() {
    this.router.navigateByUrl('/admin/dashboard');
  }
}
