import { Component } from '@angular/core';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../interface/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserHeader } from "../user-header/user-header";
import { UserFooter } from "../user-footer/user-footer";

@Component({
  selector: 'app-user-registration',
  imports: [CommonModule, FormsModule, RouterLink, UserHeader, UserFooter],
  templateUrl: './user-registration.html',
  styleUrl: './user-registration.css',
})
export class UserRegistration {
  user: User = {
    name: '',
    email: '',
    password: '',
    role: '',
    city: '',
    phone: '',
    createdAt: new Date(),
    registeredAt: new Date(),
  };

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  registerUser() {

    this.user.registeredAt = new Date();
    this.user.status = 'pending';
    // NAME VALIDATION
    if (!this.user.name) {
      alert("Please enter your name");
      return;
    }

    // EMAIL VALIDATION
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.user.email)) {
      alert("Enter valid email address");
      return;
    }



    // CITY VALIDATION
    if (!this.user.city) {
      alert("Please enter city");
      return;
    }

    // PHONE VALIDATION
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(this.user.phone)) {
      alert("Enter valid 10 digit phone number");
      return;
    }

    // ROLE VALIDATION
    if (!this.user.role) {
      alert("Please select role");
      return;
    }

  this.firebaseService.addDocument(FirebaseCollections.Users, this.user)
    .then(() => {
      alert("Registration successful! Please login after admin approval.");
      this.router.navigate(['/user/user-login']); // redirect to login
    })
    .catch(err => console.error(err));
  }
  showToast(message: string) {

    const toast = document.getElementById("liveToast");

    if (toast) {

      toast.querySelector(".toast-body")!.textContent = message;

      const toastBootstrap = new (window as any).bootstrap.Toast(toast);

      toastBootstrap.show();

    }

  }


}
