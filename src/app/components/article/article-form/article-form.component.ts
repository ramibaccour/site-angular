import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss']
})
export class ArticleFormComponent implements OnInit 
{
  constructor (private generalService : GeneralService){}
  ngOnInit() 
  {
    this.getArticle()
  }
  getArticle()
  {
    if(this.generalService.idArticle && this.generalService.idArticle >0)
    {
      this.generalService.openSnackBar(this.generalService.idArticle.toString(), false)
    }
  }
}
