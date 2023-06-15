import { Component, OnInit } from '@angular/core';
import { Accueille } from 'src/app/entites/accueille';
import { GeneralService } from 'src/app/services/general.service';
import { AccueilleService } from 'src/app/services/accueille.service';
import { TypeAccueille } from 'src/app/entites/typeAccueille';
import { TypeAccueilleService } from 'src/app/services/typeAccueille.service';
@Component({
  selector: 'app-accueille-form',
  templateUrl: './accueille-form.component.html',
  styleUrls: ['./accueille-form.component.scss']
})
export class AccueilleFormComponent implements OnInit 
{
  constructor (
    private generalService : GeneralService, 
    private accueilleService : AccueilleService,
    private typeAccueilleService : TypeAccueilleService){}
  accueille = new Accueille();
  submit = false;
  full_description;
  listeTypeAccueille : TypeAccueille[];
  formData = new FormData();
  image : {src : string, name : string, index: number,file : File | null};
  ngOnInit() 
  {
    if(this.accueilleService.idAccueille && this.accueilleService.idAccueille >0)
    {
      this.getAccueille(this.accueilleService.idAccueille)
    }
    this.getTypeAccueille()
  }
  getSrc()
  {
    if(this.accueille && this.accueille.image)
      return this.generalService.urlImage + this.accueille.image;
    return "assets/images/add-image.png";
  }
  actionImage(event)
  {
    this.image = event;
    this.formData.append('image', event.src);
    this.formData.append('name', event.name);
  }
  getTypeAccueille()
  {
    this.typeAccueilleService.getTypeAccueille().subscribe(typeAccueille =>
    {
      this.listeTypeAccueille = typeAccueille;
    })
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
    var accueille;
    accueille = JSON.parse(JSON.stringify(this.accueille))
    // il y a une image à enregister  
    if (this.formData.has('image'))
    {
      accueille.image = this.image.name;
      var fn = ()=>
      {
        this.formData = new FormData();
      }
      this.generalService.httpPost(this.formData, "/save-image",fn)
    }
    if(this.modeAdd())
      this.accueille.is_deleted = 0;
    this.accueilleService.saveAccueille(accueille).subscribe(param =>
    {
      if(param && param.id && param.id>0)
      {
        this.generalService.openSnackBar("Enregister",true);
        
        this.close();
      }
    })
  }
  close()
  {
    if(this.accueilleService.dialogRefAccueille)
      this.accueilleService.dialogRefAccueille.close();
  }
  modeAdd() : boolean
  {
    if(this.accueille.id && this.accueille.id>0)
      return false;
    return true;
  }
}
