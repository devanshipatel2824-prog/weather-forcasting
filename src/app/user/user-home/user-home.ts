import { Component } from '@angular/core';
import { UserHeader } from "../user-header/user-header";
import { UserFooter } from "../user-footer/user-footer";

@Component({
  selector: 'app-user-home',
  imports: [UserHeader, UserFooter],
  templateUrl: './user-home.html',
  styleUrl: './user-home.css',
})
export class UserHome {

}
