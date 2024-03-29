import { Component, OnInit } from '@angular/core';
import { AccueilleFilter } from 'src/app/entites/accueilleFilter';
import { AccueilleService } from 'src/app/services/accueille.service';
import { GeneralService } from 'src/app/services/general.service';
import { AccueilleFormComponent } from '../accueille-form/accueille-form.component';
import { ParametreService } from 'src/app/services/parametre.service';
import { Accueille } from 'src/app/entites/accueille';
import { AccueilTypeService } from 'src/app/services/accueilType.service';
import { AccueilType } from 'src/app/entites/accueilType';
import { Header } from 'src/app/entites/header';
import { LigneAccueilleService } from 'src/app/services/ligneAccueille.service';
import { LigneAccueilleFormComponent } from '../../ligneAccueille/ligne-accueille-form/ligne-accueille-form.component';
import { ActionTable } from 'src/app/entites/actionTable';
@Component({
  selector: 'app-accueille-liste',
  templateUrl: './accueille-liste.component.html',
  styleUrls: ['./accueille-liste.component.scss']
})
export class AccueilleListeComponent implements OnInit 
{
  constructor ( private accueilleService : AccueilleService, 
                private generalService : GeneralService, 
                private parametreService : ParametreService,
                private ligneAccueilleService : LigneAccueilleService,
                private typeAccueilleService : AccueilTypeService){}
  listeAccueille : Accueille[];
  accueilleFilter = new AccueilleFilter();
  header : Header;
  listeTypeAccueille : AccueilType[]
  ngOnInit() 
  {
    var filer;
    filer = {is_deleted : {operator : "=", value : 0}};
    this.accueilleFilter.filter = filer;
    this.getHeadAccueille();
  }
  close()
  {
    if(this.accueilleService.dialogRefCategorie)
      this.accueilleService.dialogRefCategorie.close()
  }
  modeModale()
  {
    return this.accueilleService.modeModal;
  }
  
  selectArticle()
  {
      if(this.accueilleService.selectedAccueille && this.accueilleService.selectedAccueille.length>0)
        this.close();
      else
        this.generalService.openSnackBar("Veuillez sélectionner un élément",false);
  }
  getTypeAccueille()
  {
    this.typeAccueilleService.getListeAccueilleType().subscribe(typeAccueille =>
    {
      this.listeTypeAccueille = typeAccueille;
      if(this.header)
      {
        var field = this.header.fields.find(f =>{return f.name == "accueilType.type"});
        if(field && field.filter)
        {
          field.filter.data = typeAccueille.map(type =>{ return {id : type.id?.toString(), name : type.type}});;
        }
      }
      this.getListeAccueille();
    })
  }
  getHeadAccueille()
  {
    this.parametreService.getParametre(3).subscribe(param =>
    {
      if(param && param.id)
      {
        var header = JSON.parse(param.value? param.value : "");
        header.fields = header.fields.filter(field =>{return field.show});
        if(this.modeModale())
        {
          header.fields = header.fields.filter(f =>{return f.name != "action"})
          header.selectable = "unique";
        }
        this.header = header;
        this.getTypeAccueille();
      }
    })
  }
  getListeAccueille(setSpinner = true) 
  {
    if(setSpinner)
      this.generalService.showSpinner = true;
    this.accueilleService.listeAccueille(this.accueilleFilter).subscribe(listeAccueille =>
    {
      var liste;
      liste = listeAccueille.map(acceuille =>{return {...acceuille, ...{accueilType : this.listeTypeAccueille.find(t => {return t.id == acceuille.id_accueil_type})}}});
      this.listeAccueille = liste;
      this.generalService.showSpinner = false;
    })
  }
  action(event : ActionTable)
  {
    if(event.action == "pager" || event.action == "filter")
    {
      event.filterTable.is_deleted.value = event.filter.is_deleted.value == true ? 1:  0;
      this.accueilleFilter.filter = event.filterTable;
      if(event.action == "filter" && event.component.name == "is_deleted")
      {
        this.generalService.changeIconDelete(event, this.header)          
      }
      this.getListeAccueille()
    }
    if(event.action == "cellClick")
    {
      if(event.component.name == "edit")
      {
        this.editAccueille(event.row["id"])
      }
      if(event.component.name == "add")
      {
        this.addLigneAccueille(event.row)
      }
      
      if(event.component.name == "delete")
      {
        this.deleteAccueille(event)
      }
    }      
    if(event.action == "list" || event.action == "unique")
    {
      this.accueilleService.selectedAccueille = event.selectedElement;
    }
  }
  addLigneAccueille(row)
  {
    this.ligneAccueilleService.accueille = row;
    this.ligneAccueilleService.dialogRefLigneAccueille = this.ligneAccueilleService.dialogLigneAccueille.open(LigneAccueilleFormComponent,{height: '80%', width: '80%'    })
    this.ligneAccueilleService.dialogRefLigneAccueille.afterClosed().subscribe(result => 
    {
      this.ligneAccueilleService.accueille = new Accueille();
      this.getListeAccueille();
    });
  }
  editAccueille(id)
  {
    this.accueilleService.idAccueille = id;
    this.accueilleService.dialogRefAccueille = this.accueilleService.dialogAccueille.open(AccueilleFormComponent,{height: '80%', width: '80%'    })
    this.accueilleService.dialogRefAccueille.afterClosed().subscribe(result => 
    {
      this.accueilleService.idAccueille = -1;
      this.getListeAccueille();
    });
  }
  deleteAccueille(event)
  {
    var fn  = ()=>
    {
      this.getListeAccueille();
      var btnDel = event.component.icon == "delete"
      this.generalService.openSnackBar(btnDel? "Supprimer" : "Restaurer",true);
    };
    this.generalService.deleteElement("/delete-accueille/" + event.row["id"],fn,event.component.icon);
  }
}
