import { Component, OnInit } from '@angular/core';
import { ListeParametre } from 'src/app/entites/ListeParametre';
import { ParametreFilter } from 'src/app/entites/ParametreFilter';
import { Parametre } from 'src/app/entites/parametre';
import { GeneralService } from 'src/app/services/general.service';
import { ParametreService } from 'src/app/services/parametre.service';
import { ParametreFormComponent } from '../parametre-form/parametre-form.component';
import { ActionTable } from 'src/app/entites/actionTable';
import { Header } from 'src/app/entites/header';
import { Field } from 'src/app/entites/field';

@Component({
  selector: 'app-parametre-liste',
  templateUrl: './parametre-liste.component.html',
  styleUrls: ['./parametre-liste.component.scss']
})
export class ParametreListeComponent implements OnInit 
{
  constructor (private parametreService : ParametreService, private generalService : GeneralService){}
  listeParametre = new ListeParametre();
  tabSize = [5,10,50];
  pager = 
  {
    count : 0,
    size : 5,
    page : 0,
    tabSize : this.tabSize,
    limit :  0
  }
  parametreFilter = this.getNewParametreFilter();
  header : Header;
  ngOnInit() 
  {
    this.getListeParametre(false);
    this.getHeadParametre();
  }
  getHeadParametre()
  {
    this.parametreService.getParametre(2).subscribe(param =>
    {
      if(param && param.id)
      {
        var header = JSON.parse(param.value? param.value : "");
        header.fields = header.fields.filter(field =>{return field.show});
        this.header = header;
        var field = this.header.fields.find(h => {return h.name == "type"});
        if(field)
          this.getListeParametreType(field);
      }
    })
  }
  getListeParametre(setSpinner = true) 
  {
    if(setSpinner)
      this.generalService.showSpinner = true;
    this.parametreService.listeParametre(this.parametreFilter).subscribe(listeParametre =>
    {
      this.listeParametre = listeParametre;
      this.pager.count = listeParametre.count;
      this.generalService.showSpinner = false;
    })
  }
  getListeParametreType(field : Field)
  {
    this.parametreService.getListeParametreType().subscribe(listeParametre =>
    {
      field.filter.data = listeParametre
    });
  }
  getNewParametreFilter()
  {
    var parametreFilter = new ParametreFilter();
    parametreFilter.pager = this.pager;
    var filter;
    filter = {id : {value : "", operator:""}};
    parametreFilter.filter = filter
    //parametreFilter.filter.visible.value = 1;
    return parametreFilter;
  }
  action(event : ActionTable)
  {
    if(event.action == "pager" || event.action == "filter")
    {
      this.parametreFilter.filter = event.filterTable;
    
      this.getListeParametre()
      
    }
    if(event.action == "cellClick")
    {
      if(event.component.name == "edit")
      {
        this.editParametre(event.row["id"])
      }   
    }    
  }
  editParametre(id)
  {
    this.parametreService.idParametre = id;
    this.parametreService.dialogRefParametre = this.generalService. dialog.open(ParametreFormComponent)
    this.parametreService.dialogRefParametre.afterClosed().subscribe(result => 
    {
      this.getListeParametre();
      this.parametreService.idParametre = -1;
    });
  }
}
