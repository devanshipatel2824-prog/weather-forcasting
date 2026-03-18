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

}
