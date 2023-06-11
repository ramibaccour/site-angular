import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/entites/article';
import { Field } from 'src/app/entites/field';
import { Parametre } from 'src/app/entites/parametre';
import { ArticleService } from 'src/app/services/article.service';
import { GeneralService } from 'src/app/services/general.service';
import { ParametreService } from 'src/app/services/parametre.service';
declare var Quill : any;
@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss']
})
export class ArticleFormComponent implements OnInit 
{
  constructor (private generalService : GeneralService, private parametreService : ParametreService, private articleService : ArticleService){}
  article = new Article();
  submit = false;
  description;
  full_description;
  parametre : Parametre;
  fields : Field[] = new Array()
  ngOnInit() 
  {     
    this.getHeadArticle();
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
    if(id && id>0)
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
    if(this.articleService.idArticle && this.articleService.idArticle >0)
      return true
    return false
  }
  save()
  {

    if(this.modeAdd())
      this.article.is_deleted = 0;
    this.articleService.saveArticle(this.article).subscribe(article =>
    {
      if(article && article.id && article.id>0)
      {
        this.generalService.openSnackBar("Enregister",true)
        this.close();
      }
    })
  }
  modeAdd() : boolean
  {
    if(this.article.id && this.article.id>0)
      return false;
    return true;
  }
  close()
  {
    if(this.articleService.dialogRefArticle)
      this.articleService.dialogRefArticle.close();
  }
  getHeadArticle()
  {
    this.parametreService.getParametre(1).subscribe(param =>
    {
      this.parametre = param;
      var header = JSON.parse(param.value? param.value : "");
      this.fields = header.fields;
      setTimeout(()=>
      {
        this.initQuil();
        this.getArticle(this.articleService.idArticle);
      },50)
     
    })
  }
  showFiled(name : string) : boolean
  {
    var myField = this.fields.find(field =>{return field.name == name});
    if(myField && myField.active)
      return true;
    return false
  }
}
