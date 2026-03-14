import { Component } from '@angular/core';
import { UserFooter } from "../user-footer/user-footer";
import { UserHeader } from "../user-header/user-header";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-user-login',
  imports: [UserFooter, UserHeader, CommonModule, FormsModule, RouterLink],
  templateUrl: './user-login.html',
  styleUrl: './user-login.css',
})
export class UserLogin {

email:string='';
password:string='';

loginUser(){

if(!this.email || !this.password){
alert("Please enter email and password");
return;
}

console.log("Login Data",this.email,this.password);

}
}
