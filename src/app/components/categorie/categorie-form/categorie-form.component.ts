import { Component,OnInit } from '@angular/core';
import { Categorie } from 'src/app/entites/categorie';
import { CategorieService } from 'src/app/services/categorie.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-categorie-form',
  templateUrl: './categorie-form.component.html',
  styleUrls: ['./categorie-form.component.scss']
})
export class CategorieFormComponent implements OnInit 
{
  constructor (private generalService : GeneralService, private categorieService : CategorieService){}
  categorie = new Categorie();
  submit = false;
  ngOnInit() 
  {     
    this.getCategorie(this.categorieService.idCategorie);
  }
  getCategorie(id)
  {
    if(!this.modeAdd())
    {
      if(id && id>0)
        this.categorieService.getCategorie(id).subscribe(categorie =>
        {
          this.categorie = categorie;
        })

    }
    else if( this.categorieService.idCategorie>0)
      this.categorie.id_parent = this.categorieService.idCategorie;
  }
  modeModale() : boolean
  {
    if(this.categorieService.idCategorie && this.categorieService.idCategorie >0)
      return true
    return false
  }
  save()
  {
    if(this.modeAdd())
      this.categorie.is_deleted = 0;
    this.categorieService.saveCategorie(this.categorie).subscribe(categorie =>
    {
      if(categorie && categorie.id && categorie.id>0)
      {
        this.generalService.openSnackBar("Enregister",true)
        if(this.modeAdd())
        {
          this.categorie = new Categorie();
          if( this.categorieService.idCategorie>0)
            this.categorie.id_parent = this.categorieService.idCategorie;
        }
        else if(this.modeModale())
          this.close();
      }
    })
  }
  modeAdd() : boolean
  {
    if(!this.modeModale())
    {
      if(this.categorie.id && this.categorie.id>0)
        return false;
      return true;
    }
    if(this.categorieService.categorieMode == 'Update')
      return false;
    return true;
  }
  close()
  {
    if(this.categorieService.dialogRefCategorie)
      this.categorieService.dialogRefCategorie.close();
  }
}
