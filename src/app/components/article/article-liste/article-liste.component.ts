import { Component, OnInit } from '@angular/core';
import { ArticleFilter } from 'src/app/entites/articleFilter';
import { DateFilter } from 'src/app/entites/dateFilter';
import { ListeArticle } from 'src/app/entites/listeArticle';
import { ArticleService } from 'src/app/services/article.service';
import { GeneralService } from 'src/app/services/general.service';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { ParametreService } from 'src/app/services/parametre.service';

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
  pager = 
  {
    count : 0,
    size : 5,
    page : 0,
    tabSize : this.tabSize
  }
  articleFilter = new ArticleFilter(0,new DateFilter(),new DateFilter());//this.getNewArticleFilter()
  header;
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
        var header = JSON.parse(param.value? param.value : "");
        header.fields = header.fields.filter(field =>{return field.show && field.active});
        var fieldDebut_promo = header.fields.find(field => {return field.name == "debut_promo"});
        if(fieldDebut_promo)
        {
          fieldDebut_promo.filter.value.start = this.articleFilter.debut_promoFilter.start
          fieldDebut_promo.filter.value.end = this.articleFilter.debut_promoFilter.end
        }
        this.header = header;
      }
    })
  }
  getListeArticle(setSpinner = true) 
  {
    if(setSpinner)
      this.generalService.showSpinner = true;
    this.articleService.listeArticle((this.pager.page * this.pager.size).toString(), this.pager.size.toString(),this.articleFilter).subscribe(listeArticle =>
    {
      this.listeArticle = listeArticle;
      this.pager.count = listeArticle.count;
      this.generalService.showSpinner = false;
    })
  }
  getNewArticleFilter()
  {
    var dateDebut = new Date()
    dateDebut.setMonth(dateDebut.getMonth()-1 );
    var datefin = new Date()
    var dateFilter = new DateFilter()
    dateFilter.start = dateDebut;
    dateFilter.end = datefin;
    var articleFilter = new ArticleFilter(0,dateFilter ,new DateFilter());
    return articleFilter;
  }
  action(event)
  {
    if(event.action == "pager" || event.action == "filter")
    {
      event.filterTable.is_deleted = event.filter.is_deleted == true ? "1":  "0";
      this.articleFilter = event.filterTable;
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
}
