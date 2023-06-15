import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { LigneAccueilleService } from 'src/app/services/ligneAccueille.service';
import { LigneAccueille } from 'src/app/entites/ligneAccueil';
@Component({
  selector: 'app-ligne-accueille-form',
  templateUrl: './ligne-accueille-form.component.html',
  styleUrls: ['./ligne-accueille-form.component.scss']
})
export class LigneAccueilleFormComponent implements OnInit 
{
  constructor (
    private generalService : GeneralService, 
    private ligneAccueilleService : LigneAccueilleService){}
  ligneAccueille = new LigneAccueille();
  submit = false;
  formData = new FormData();
  image : {src : string, name : string, index: number,file : File | null};
  ngOnInit() 
  {
    if(this.ligneAccueilleService.idLigneAccueille && this.ligneAccueilleService.idLigneAccueille >0)
    {
      this.getLigneAccueille(this.ligneAccueilleService.idLigneAccueille)
    }
  }
  getSrc()
  {
    if(this.ligneAccueille && this.ligneAccueille.image)
      return this.generalService.urlImage + this.ligneAccueille.image;
    return "assets/images/add-image.png";
  }
  actionImage(event)
  {
    this.image = event;
    this.formData.append('image', event.src);
    this.formData.append('name', event.name);
  }
  
  getLigneAccueille(id)
  {
    this.ligneAccueilleService.getLigneAccueille(id).subscribe(param =>
    {
      this.ligneAccueille = param;
    })
  }
  modeModale() : boolean
  {
    if(this.ligneAccueilleService.idLigneAccueille && this.ligneAccueilleService.idLigneAccueille >0)
      return true
    return false
  }
  save()
  {
    var ligneAccueille;
    ligneAccueille = JSON.parse(JSON.stringify(this.ligneAccueille))
    // il y a une image à enregister  
    if (this.formData.has('image'))
    {
      ligneAccueille.image = this.image.name;
      var fn = ()=>
      {
        this.formData = new FormData();
      }
      this.generalService.httpPost(this.formData, "/save-image",fn)
    }
    if(this.modeAdd())
      this.ligneAccueille.is_deleted = 0;
    this.ligneAccueilleService.saveLigneAccueille(ligneAccueille).subscribe(param =>
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
    if(this.ligneAccueilleService.dialogRefLigneAccueille)
      this.ligneAccueilleService.dialogRefLigneAccueille.close();
  }
  modeAdd() : boolean
  {
    if(this.ligneAccueille.id && this.ligneAccueille.id>0)
      return false;
    return true;
  }
}
