import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { UserHeader } from "../user-header/user-header";
import { UserFooter } from "../user-footer/user-footer";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoriteCity } from '../../interface/favorite';

@Component({
  selector: 'app-favorites-city',
  standalone: true,
  imports: [UserHeader, UserFooter, CommonModule, FormsModule],
  templateUrl: './favorites-city.html',
  styleUrl: './favorites-city.css',
})
export class FavoritesCity implements OnInit {

  favorites: FavoriteCity[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.firebaseService.getAllFavorites().subscribe({
      next: (favs) => {
       
        this.favorites = favs.map(fav => ({
          ...fav,
          
          addedAt: (fav as any).addedAt?.toDate ? (fav as any).addedAt.toDate() : (fav as any).addedAt
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error:", err)
    });
  }

  deleteFavorite(favId: string) {
    this.firebaseService.deleteFavoriteCity(favId).then(() => {
      
    });
  }
}