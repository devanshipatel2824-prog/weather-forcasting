  import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FavoriteCity } from '../../interface/favorite';
  import { FirebaseService } from '../../firebase-service/firebase-service';
  import { Sidebar } from "../sidebar/sidebar";

  @Component({
    selector: 'app-manage-favorite',
    standalone: true,
    imports: [CommonModule, Sidebar],
    templateUrl: './manage-favorite.html',
    styleUrl: './manage-favorite.css',
  })
  export class ManageFavorite implements OnInit {

   favorites: FavoriteCity[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef
  ) {}

 ngOnInit() {
  this.firebaseService.getAllFavorites().subscribe(data => {
    this.favorites = data.map(fav => ({
      ...fav,
      // Jo Firebase Timestamp hoy to toDate() karo, nahito direct date vapro
      addedAt: fav.addedAt?.toDate ? fav.addedAt.toDate() : fav.addedAt 
    }));
    this.cdr.detectChanges();
  });
}
  loadFavorites() {
    this.firebaseService.getAllFavorites().subscribe(data => {
      this.favorites = data;
      this.cdr.detectChanges();
    });
  }

  deleteFavorite(id: string) {
    if (confirm('Are you sure you want to remove this city?')) {
      this.firebaseService.deleteFavoriteCity(id).then(() => {
        // Refresh data after delete
        this.loadFavorites();
      });
    }
  }
  }