import { Component, OnInit } from '@angular/core';
import { Accueille } from 'src/app/entites/accueille';
import { GeneralService } from 'src/app/services/general.service';
import { AccueilleService } from 'src/app/services/accueille.service';
@Component({
  selector: 'app-accueille-form',
  templateUrl: './accueille-form.component.html',
  styleUrls: ['./accueille-form.component.scss']
})
export class AccueilleFormComponent   implements OnInit 
{
  constructor (private generalService : GeneralService, private accueilleService : AccueilleService){}
  accueille = new Accueille();
  submit = false;
  description;
  full_description;
  ngOnInit() 
  {
    if(this.accueilleService.idAccueille && this.accueilleService.idAccueille >0)
    {
      this.getAccueille(this.accueilleService.idAccueille)
    }
  }
  getAccueille(id)
  {
    this.accueilleService.getAccueille(id).subscribe(param =>
    {
      this.accueille = param;
    })
  }
  modeModale() : boolean
  {
    if(this.accueilleService.idAccueille && this.accueilleService.idAccueille >0)
      return true
    return false
  }
  save()
  {
    this.accueilleService.saveAccueille(this.accueille).subscribe(param =>
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
    if(this.accueilleService.dialogRefAccueille)
      this.accueilleService.dialogRefAccueille.close();
  }
}
