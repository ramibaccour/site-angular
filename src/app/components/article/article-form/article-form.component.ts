import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/entites/article';
import { ArticleService } from 'src/app/services/article.service';
import { GeneralService } from 'src/app/services/general.service';
declare var Quill : any;
@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss']
})
export class ArticleFormComponent implements OnInit 
{
  constructor (private generalService : GeneralService, private articleService : ArticleService){}
  article = new Article();
  submit = false;
  description;
  full_description;
  ngOnInit() 
  {
    this.initQuil();
    if(this.generalService.idArticle && this.generalService.idArticle >0)
    {
      this.getArticle(this.generalService.idArticle)
    }
  }
  initQuil()
  {
    this.description = new Quill('#description', 
    {
      theme: 'snow'
    });
    this.full_description = new Quill('#full_description', 
    {
      theme: 'snow'
    });
  }
  getArticle(id)
  {
    this.articleService.getArticle(id).subscribe(art =>
    {
      this.article = art;
      this.setData(this.description, this.article.description)
      this.setData(this.full_description, this.article.full_description)
    })
  }
  getData(quill)
  {
    return quill.root.innerHTML;
  }
  
  setData(quill,html) 
  {
    quill.clipboard.dangerouslyPasteHTML(html);
  }
  
  modeModale() : boolean
  {
    if(this.generalService.idArticle && this.generalService.idArticle >0)
      return true
    return false
  }
  save()
  {

  }
  close()
  {
    this.generalService.dialogRefArticle.close();
  }
}
