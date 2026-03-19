import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from '../../interface/user';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { AdminSidebar } from "../admin-sidebar/admin-sidebar";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-user',
  imports: [AdminSidebar, CommonModule],
  templateUrl: './manage-user.html',
  styleUrl: './manage-user.css',
})
export class ManageUser implements OnInit {

  pendingUsers: User[] = [];
  processedUsers: User[] = []; // 🔥 approved + rejected

  constructor(
    private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getUsersRealtime();
  }

  getUsersRealtime() {
    this.firebaseService.getAllUsers().subscribe(users => {

      // 🔼 Pending
      this.pendingUsers = users.filter(u => !u.status || u.status === 'pending');

      // 🔽 Approved + Rejected (single table)
      this.processedUsers = users.filter(
        u => u.status === 'approved' || u.status === 'rejected'
      );

      this.cdr.detectChanges();
    });
  }

  approveUser(userId: string) {
    this.firebaseService.updateUserStatus(userId, 'approved');
  }

  rejectUser(userId: string) {
    this.firebaseService.updateUserStatus(userId, 'rejected');
  }
}