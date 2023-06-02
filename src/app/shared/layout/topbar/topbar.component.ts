import {  Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/entites/user';
import { GeneralService } from 'src/app/services/general.service';
declare var $;
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit 
{
  showMenu = false;
  constructor(public generalService : GeneralService) { }
  ngOnInit() 
  {
  }   
  doMenu()
  {
    if ($(window).width() >= 681)
    {
      this.generalService.showMenu = !this.generalService.showMenu;
    }
    else
    {
      this.showMenu = !this.showMenu;

    }
  }
  profile()
  {
    this.generalService.router.navigate(['utilisateur/profile']);
  }
  deconnection()
  {
      localStorage.removeItem('user');
      this.generalService.user = new User();
      this.generalService.headers = null;
      this.generalService.router.navigate(["login"]);
  }
}
