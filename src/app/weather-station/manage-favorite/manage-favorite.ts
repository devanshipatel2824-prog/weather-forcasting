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
    private cdr: ChangeDetectorRef   // ✅ Inject CDR
  ) {}

  ngOnInit() {
    this.firebaseService.getAllFavorites().subscribe(data => {
      this.favorites = data;

      this.cdr.detectChanges();  // 🔥 FORCE UI UPDATE
    });
  }
}