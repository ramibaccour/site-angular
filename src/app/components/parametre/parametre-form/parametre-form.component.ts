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
    if(this.parametreService.idParametre && this.parametreService.idParametre >0)
    {
      this.getParametre(this.parametreService.idParametre)
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
    if(this.parametreService.idParametre && this.parametreService.idParametre >0)
      return true
    return false
  }
  save()
  {
    this.parametreService.saveParametre(this.parametre).subscribe(param =>
    {
      if(param && param.id && param.id>0)
      {
        this.generalService.openSnackBar("Enregister",true)
        this.close();
      }
    })
  }
  close()
  {
    if(this.parametreService.dialogRefParametre)
      this.parametreService.dialogRefParametre.close();
  }
}
