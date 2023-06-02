import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/entites/user';
import { GeneralService } from 'src/app/services/general.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit 
{
  user = new User();
  userResponse;
  resterConnecter = false;
  
  typeInput = "password";
  iconPassword = "visibility";
  constructor(public generalService : GeneralService, private router: Router, private userService : UserService) { }

  ngOnInit(): void 
  {
    this.init()
  }
  init()
  {
    this.userResponse = {}
  }
 
  showPassword()
  {
    if(this.typeInput == "password")
    {
      this.typeInput = "text";
      this.iconPassword = "visibility_off" ;
    }      
    else
    {
      this.typeInput = "password";
      this.iconPassword = "visibility" ;

    }
  }
  signin()
  {
    this.generalService.showSpinner = true;
    this.userService.signin(this.user).subscribe(user =>
    {
      this.generalService.showSpinner = false;
      this.generalService.user = user;
      if(this.resterConnecter)
      localStorage.setItem("user",JSON.stringify(user));   
      this.router.navigate(["/accueille"])

    })
  }
}

