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
  this.firebaseService.getAllFavorites().subscribe(favs => {
    console.log("DATA:", favs);   // 👈 check this

    this.favorites = favs.map(fav => ({
      ...fav,
      addedAt: fav.addedAt?.toDate ? fav.addedAt.toDate() : fav.addedAt
    }));

    this.cdr.detectChanges();
  });
}

  deleteFavorite(favId: string) {
    this.firebaseService.deleteFavoriteCity(favId)
      .then(() => {
        // no need reload
      });
  }
}