import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { AdminSidebar } from "../admin-sidebar/admin-sidebar";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [AdminSidebar, CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {

  totalUsers = 0;
  totalSearch = 0;
  totalFavorites = 0;
  totalAlerts = 0;

  searchHistory: any[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef   // 🔥 important
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {

    // 🔹 USERS
    this.firebaseService.getCollection(FirebaseCollections.Users)
      .subscribe(data => {
        this.totalUsers = data.length;
        this.cdr.detectChanges();   // 🔥 force UI update
      });

    // 🔹 SEARCH HISTORY
    this.firebaseService.getCollection(FirebaseCollections.SearchHistory)
      .subscribe((data: any[]) => {
        this.totalSearch = data.length;

        this.searchHistory = data
          .sort((a, b) =>
            new Date(b.searchedAt).getTime() - new Date(a.searchedAt).getTime()
          )
          .slice(0, 5);

        this.cdr.detectChanges();   // 🔥 important
      });

    // 🔹 FAVORITES
    this.firebaseService.getCollection(FirebaseCollections.Favorites)
      .subscribe(data => {
        this.totalFavorites = data.length;
        this.cdr.detectChanges();
      });

    // 🔹 ALERTS
    this.firebaseService.getCollection(FirebaseCollections.Alerts)
      .subscribe(data => {
        this.totalAlerts = data.length;
        this.cdr.detectChanges();
      });
  }
}