import { Component, OnInit } from '@angular/core';
import { ArticleFilter } from 'src/app/entites/articleFilter';
import { DateFilter } from 'src/app/entites/dateFilter';
import { ListeArticle } from 'src/app/entites/listeArticle';
import { ArticleService } from 'src/app/services/article.service';
import { GeneralService } from 'src/app/services/general.service';
import { DialogComponent } from 'src/app/shared/utility/dialog/dialog.component';
import { ArticleFormComponent } from '../article-form/article-form.component';

@Component({
  selector: 'app-article-liste',
  templateUrl: './article-liste.component.html',
  styleUrls: ['./article-liste.component.scss']
})
export class ArticleListeComponent implements OnInit 
{
  constructor (private articleService : ArticleService, private generalService : GeneralService){}
  listeArticle = new ListeArticle();
  tabSize = [5,10,50];
  pager = 
  {
    count : 0,
    size : 5,
    page : 0,
    tabSize : this.tabSize
  }
  articleFilter = this.getNewArticleFilter();
  header = {
    fields : 
            [
              {
                name: "name",
                type:"text",//text, bouton, link, icon
                label:"Nom service",
                minWidth : "100px",
                width:"30%",
                filter : 
                {
                  show:true,
                  type:"text",//text, select, checkbox, date
                  value : ""
                },
                order:1
                
              },
              {
                name: "description",
                type:"text",//text, bouton, link, icon
                label:"Description",
                minWidth : "100px",
                width:"30%",
                filter : 
                {
                  show:true,
                  type:"text",//text, select, checkbox, date
                  value : ""
                },
                order:2
                
              },   
              {
                name: "debut_promo",
                type:"date",//text, bouton, link, icon
                label:"Début promo",
                minWidth : "100px",
                width:"30%",
                filter : 
                {
                  show:true,
                  type:"date",//text, select, checkbox, date
                  returnProperty : "debut_promoFilter",
                  value : {start : this.articleFilter.debut_promoFilter.start, end : this.articleFilter.debut_promoFilter.end}
                },
                order:3
                
              },             
              {
                name:"is_deleted",
                type:"icon",//text, bouton, link, icon, date
                label:"Supprimer",
                filter:
                        {
                          show:true,
                          type:"checkbox",//text, select, checkbox, date
                          value :""
                        },
                minWidth : "100px",
                width:"30%",
                order:6
              },
              {
                name:"action",
                type:"action",//text, bouton, link, icon, date
                label:"Action",
                minWidth : "100px",
                width:"30%",
                buttons: 
                [
                  {name:"delete",icon:"delete",label:"Supprimer",color:"#f44336"},
                  {name:"edit",icon:"edit",label:"Editer",color:"#3f51b5"}
                ],
                order:8
              }
            ],
    showFilter : true,
    breakpoint : 830
  };
  ngOnInit() 
  {
    this.getListeArticle(false);
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
    var articleFilter = new ArticleFilter(dateFilter ,new DateFilter());
    articleFilter.is_deleted = 0;
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
    this.generalService.idArticle = id;
    const dialogRef = this.generalService. dialog.open(ArticleFormComponent)
    dialogRef.afterClosed().subscribe(result => 
    {
      this.getListeArticle()
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
