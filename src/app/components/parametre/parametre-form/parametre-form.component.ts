import { Component, OnInit } from '@angular/core';
import { Parametre } from 'src/app/entites/parametre';
import { GeneralService } from 'src/app/services/general.service';
import { ParametreService } from 'src/app/services/parametre.service';

@Component({
  selector: 'app-parametre-form',
  templateUrl: './parametre-form.component.html',
  styleUrls: ['./parametre-form.component.scss']
})
export class ParametreFormComponent  implements OnInit 
{
  constructor (private generalService : GeneralService, private parametreService : ParametreService){}
  parametre = new Parametre();
  submit = false;
  description;
  full_description;
  ngOnInit() 
  {
    if(this.generalService.idParametre && this.generalService.idParametre >0)
    {
      this.getParametre(this.generalService.idParametre)
    }
  }
  getParametre(id)
  {
    this.parametreService.getParametre(id).subscribe(param =>
    {
      this.parametre = param;
    })
  }
  modeModale() : boolean
  {
    if(this.generalService.idParametre && this.generalService.idParametre >0)
      return true
    return false
  }
  save()
  {
    this.parametreService.saveParametre(this.parametre).subscribe(param =>
    {
      this.parametre = param;
    })
  }
  close()
  {
    this.generalService.dialogRefParametre.close();
  }
}
