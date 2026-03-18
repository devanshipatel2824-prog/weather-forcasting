import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Alert } from '../../interface/alert';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from "../admin-sidebar/admin-sidebar";
import { FirebaseCollections } from '../../firebase-service/firebase-enum';

@Component({
  selector: 'app-manage-alert',
  imports: [CommonModule, FormsModule, AdminSidebar],
  templateUrl: './manage-alert.html',
  styleUrl: './manage-alert.css',
})
export class ManageAlert implements OnInit {

  alerts: Alert[] = [];
isEditMode = false;
editId: string = '';

  newAlert: any = {
  title: '',
  message: '',
  roles: [],
  status: 'Active'
};

  rolesList = ['Student', 'Farmer', 'Traveler']; // 🔥 dynamic dropdown

  constructor(
    private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getAlertsRealtime();
  }

  // 🔥 realtime alerts
  getAlertsRealtime() {
    this.firebaseService.getAllAlerts().subscribe(data => {
      this.alerts = data;
      this.cdr.detectChanges();
    });
  }

  // 🔥 create alert
  createAlert() {

  if (this.isEditMode) {
    // 🔥 UPDATE
    this.firebaseService.updateAlert(this.editId, this.newAlert)
      .then(() => {
        this.resetForm();
      });

  } else {
    // 🔥 CREATE
    this.firebaseService.addAlert(this.newAlert)
      .then(() => {
        this.resetForm();
      });
  }
}

  deleteAlert(id: string) {
    this.firebaseService.deleteAlert(id);
  }

 editAlertData(alert: any) {
  this.newAlert = {
    title: alert.title,
    message: alert.message,
    roles: [...alert.roles],
    status: alert.status
  };

  this.editId = alert.id;
  this.isEditMode = true;
}
resetForm() {
  this.newAlert = {
    title: '',
    message: '',
    roles: [],
    status: 'Active'
  };
  this.isEditMode = false;
  this.editId = '';
}
}