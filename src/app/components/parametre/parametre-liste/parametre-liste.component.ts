import { Component, OnInit } from '@angular/core';
import { ListeParametre } from 'src/app/entites/ListeParametre';
import { ParametreFilter } from 'src/app/entites/ParametreFilter';
import { Parametre } from 'src/app/entites/parametre';
import { GeneralService } from 'src/app/services/general.service';
import { ParametreService } from 'src/app/services/parametre.service';
import { ParametreFormComponent } from '../parametre-form/parametre-form.component';
import { ActionTable } from 'src/app/entites/actionTable';

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
    tabSize : this.tabSize
  }
  parametreFilter = this.getNewParametreFilter();
  header;
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
      }
    })
  }
  getListeParametre(setSpinner = true) 
  {
    if(setSpinner)
      this.generalService.showSpinner = true;
    this.parametreService.listeParametre((this.pager.page * this.pager.size).toString(), this.pager.size.toString(),this.parametreFilter).subscribe(listeParametre =>
    {
      this.listeParametre = listeParametre;
      this.pager.count = listeParametre.count;
      this.generalService.showSpinner = false;
    })
  }
  getNewParametreFilter()
  {
    var parametreFilter = new ParametreFilter();
    // parametreFilter.visible = 1;
    return parametreFilter;
  }
  action(event : ActionTable)
  {
    if(event.action == "pager" || event.action == "filter")
    {
      this.parametreFilter = event.filterTable;
    
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
