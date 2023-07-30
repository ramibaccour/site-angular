import { Component, OnInit } from '@angular/core';
import { ArticleFilter } from 'src/app/entites/articleFilter';
import { DateFilter } from 'src/app/entites/dateFilter';
import { ListeArticle } from 'src/app/entites/listeArticle';
import { ArticleService } from 'src/app/services/article.service';
import { GeneralService } from 'src/app/services/general.service';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { ParametreService } from 'src/app/services/parametre.service';
import { Header } from 'src/app/entites/header';
import { ActionTable } from 'src/app/entites/actionTable';
import { Pager } from 'src/app/entites/pager';

@Component({
  selector: 'app-article-liste',
  templateUrl: './article-liste.component.html',
  styleUrls: ['./article-liste.component.scss']
})
export class ArticleListeComponent implements OnInit 
{
  constructor (private articleService : ArticleService, private generalService : GeneralService, private parametreService : ParametreService){}
  listeArticle = new ListeArticle();
  tabSize = [5,10,50];
  pager : Pager = 
  {
    count : 0,
    size : 5,
    page : 0,
    tabSize : this.tabSize,
    limit :  0
  }
  articleFilter : ArticleFilter = new ArticleFilter(this.pager,{ value : 0, operator : "="});
  header : Header;
  ngOnInit() 
  {
    this.getHeadArticle();
    this.getListeArticle(false);
  }
  getHeadArticle()
  {
    this.parametreService.getParametre(1).subscribe(param =>
    {
      if(param && param.id)
      {
        var header : Header = JSON.parse(param.value? param.value : "");
        header.fields = header.fields.filter(field =>{return field.show});
        var fieldDebut_promo = header.fields.find(field => {return field.name == "debut_promo"});
        if(fieldDebut_promo)
        {
          if(this.articleFilter.filter.debut_promo && this.articleFilter.filter.debut_promo.value && this.articleFilter.filter.debut_promo.value.start )
          {
            fieldDebut_promo.filter.value.start = this.articleFilter.filter.debut_promo.value.start;
            fieldDebut_promo.filter.value.end = this.articleFilter.filter.debut_promo.value.end;
          }
        }
        if(this.modeModale())
        {
          header.fields = header.fields.filter(f =>{return f.name != "action"})
          header.selectable = "unique";
        }
        this.header = header;
      }
    })
  }
  getListeArticle(setSpinner = true) 
  {
    if(setSpinner)
      this.generalService.showSpinner = true;
    this.articleService.listeArticle(this.articleFilter).subscribe(listeArticle =>
    {
      this.listeArticle = listeArticle;
      this.pager.count = listeArticle.count;
      this.generalService.showSpinner = false;
    })
  }
  
  action(event : ActionTable)
  {
    if(event.action == "pager" || event.action == "filter")
    {
      event.filterTable.is_deleted.value = event.filter.is_deleted.value == true ? 1:  0
      this.articleFilter.filter = event.filterTable;
      if(event.action == "filter" && event.component.name == "is_deleted")
      {
        this.generalService.changeIconDelete(event, this.header)          
      }
      this.getListeArticle()
      
    }
    if(event.action == "cellClick")
    {
      if(event.component.name == "edit")
      {
        this.editArtile(event.row["id"])
      }
      
      if(event.component.name == "delete")
      {
        this.deleteArticle(event)
      }
    }    
    if(event.action == "list" || event.action == "unique")
    {
      this.articleService.selectedArticle = event.selectedElement;
    }
  }
  editArtile(id)
  {
    this.articleService.idArticle = id;
    this.articleService.dialogRefArticle = this.articleService.dialogArticle.open(ArticleFormComponent,{height: '80%', width: '80%'    })
    this.articleService.dialogRefArticle.afterClosed().subscribe(result => 
    {
      this.articleService.idArticle = -1;
      this.getListeArticle();
    });
  }
  deleteArticle(event)
  {
    var fn  = ()=>
    {
      this.getListeArticle();
      var btnDel = event.component.icon == "delete"
      this.generalService.openSnackBar(btnDel? "Supprimer" : "Restaurer",true);
    };
    this.generalService.deleteElement("/delete-article/" + event.row["id"],fn,event.component.icon);
  }
  close()
  {
    if(this.articleService.dialogRefArticle)
      this.articleService.dialogRefArticle.close()
  }
  modeModale()
  {
    return this.articleService.modeModal;
  }
  selectArticle()
  {
      if(this.articleService.selectedArticle && this.articleService.selectedArticle.length>0)
        this.close();
      else
        this.generalService.openSnackBar("Veuillez sélectionner un élément",false);
  }
}
