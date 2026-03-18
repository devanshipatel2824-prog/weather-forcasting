import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
loginForm: FormGroup;
  toastMsg = ''; // for toast messages

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastMsg = 'Please enter valid email and password';
      return;
    }

    // ✅ Static Admin Credentials
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    const { email, password } = this.loginForm.value;

    if (email === adminEmail && password === adminPassword) {
      // ✅ Successful login
      localStorage.setItem('adminLogin', 'true');
      this.toastMsg = 'Login successful! Redirecting...';

      setTimeout(() => {
        this.router.navigateByUrl('admin/admin-dashboard');
      }, 1000); // show toast for 1 sec before redirect
    } else {
      // ❌ Wrong email/password
      this.toastMsg = 'Invalid email or password';
    }
  }

  // Optional getters for template validation
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
