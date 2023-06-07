import { Component, OnInit } from '@angular/core';
import { ListeParametre } from 'src/app/entites/ListeParametre';
import { ParametreFilter } from 'src/app/entites/ParametreFilter';
import { Parametre } from 'src/app/entites/parametre';
import { GeneralService } from 'src/app/services/general.service';
import { ParametreService } from 'src/app/services/parametre.service';
import { ParametreFormComponent } from '../parametre-form/parametre-form.component';

@Component({
  selector: 'app-parametre-liste',
  templateUrl: './parametre-liste.component.html',
  styleUrls: ['./parametre-liste.component.scss']
})
export class ParametreListeComponent implements OnInit 
{constructor (private parametreService : ParametreService, private generalService : GeneralService){}
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
header = {
  fields : 
          [
            {
              name: "name",
              type:"text",//text, bouton, link, icon
              label:"Nom",
              minWidth : "100px",
              width:"30%",
              filter : 
              {
                show:true,
                type:"text",//text, select, checkbox, date
                value : ""
              },
              show : true,
              required : true,
              order:1
              
            },
            {
              name: "value",
              type:"text",//text, bouton, link, icon
              label:"Valeur",
              minWidth : "100px",
              width:"30%",
              filter : 
              {
                show:true,
                type:"text",//text, select, checkbox, date
                value : ""
              },
              show : true,
              required : true,
              order:2
              
            },
            {
              name:"action",
              type:"action",//text, bouton, link, icon, date
              label:"Action",
              minWidth : "100px",
              width:"30%",
              buttons: 
              [
                {name:"edit",icon:"edit",label:"Editer",color:"#3f51b5"}
              ],
              show : true,
              required : true,
              order:8
            }
          ],
  showFilter : true,
  breakpoint : 830
};
ngOnInit() 
{
  this.getListeParametre(false);
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
  return new ParametreFilter();
}
action(event)
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
  this.generalService.idParametre = id;
  const dialogRef = this.generalService. dialog.open(ParametreFormComponent)
  dialogRef.afterClosed().subscribe(result => 
  {
    this.getListeParametre()
  });
}
}
