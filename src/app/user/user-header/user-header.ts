import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-header',
  imports: [RouterLink],
  templateUrl: './user-header.html',
  styleUrl: './user-header.css',
})
export class UserHeader {
isScrolled=false;

@HostListener('window:scroll',[])
onScroll(){
this.isScrolled=window.scrollY>50;
}

}
