import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Alert } from '../../interface/alert';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { CommonModule } from '@angular/common';
import { UserFooter } from "../user-footer/user-footer";
import { UserHeader } from "../user-header/user-header";
import { FirebaseCollections } from '../../firebase-service/firebase-enum';

@Component({
  selector: 'app-view-alert',
  standalone: true,
  imports: [CommonModule, UserFooter, UserHeader],
  templateUrl: './view-alert.html',
  styleUrl: './view-alert.css',
})
export class ViewAlert implements OnInit {

  alerts: Alert[] = [];
  userRole: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    this.userRole = user.role || '';

    this.firebaseService
      .getDocumentsByField<Alert>(FirebaseCollections.Alerts, 'status', 'Active')
      .subscribe(allAlerts => {

        this.alerts = allAlerts
          .filter(alert => {
            if (!alert.roles) return false;

            return Array.isArray(alert.roles)
              ? alert.roles.includes(this.userRole)
              : alert.roles === this.userRole;
          })
          .sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        this.cdr.detectChanges(); // 🔥 IMPORTANT
      });
  }
}