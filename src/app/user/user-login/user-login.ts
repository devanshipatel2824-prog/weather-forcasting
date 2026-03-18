import { Component } from '@angular/core';
import { UserFooter } from "../user-footer/user-footer";
import { UserHeader } from "../user-header/user-header";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { FirebaseService } from '../../firebase-service/firebase-service';
import { User } from '../../interface/user';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';

@Component({
  selector: 'app-user-login',
  imports: [UserFooter, UserHeader, CommonModule, FormsModule, RouterLink],
  templateUrl: './user-login.html',
  styleUrl: './user-login.css',
})
export class UserLogin {

  email: string = '';
  password: string = '';

  constructor(private firebaseService: FirebaseService, private router: Router) { }


if (tempCity: any) {
  localStorage.removeItem('tempCity');
  this.router.navigate(['/user/weather-search'], { queryParams: { city: tempCity } });
}
  loginUser() {
    if (!this.email || !this.password) {
      alert("Please enter email and password");
      return;
    }

    this.firebaseService.getDocumentsByField<User>(FirebaseCollections.Users, 'email', this.email)
      .subscribe(users => {
        if (users.length === 0) { alert("User not found"); return; }
        const user = users[0];

        if (user.password !== this.password) { alert("Invalid password"); return; }
        if (user.status !== 'approved') { alert("Your account is not approved by admin yet"); return; }

        localStorage.setItem('loggedInUser', JSON.stringify(user));
        alert("Login successful!");

        // Redirect to role-based dashboard
        if (user.role === 'Student') this.router.navigate(['/user/dashboard/student']);
        else if (user.role === 'Farmer') this.router.navigate(['/user/dashboard/farmer']);
        else if (user.role === 'Traveler') this.router.navigate(['/user/dashboard/traveler']);
        else this.router.navigate(['/user/user-home']);
      });
  }
}
