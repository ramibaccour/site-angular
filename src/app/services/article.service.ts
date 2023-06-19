import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { ListeArticle } from '../entites/listeArticle';
import { ArticleFilter } from '../entites/articleFilter';
import { Article } from '../entites/article';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ArticleService 
{
  constructor(private http: HttpClient,private generalService : GeneralService,public dialogArticle: MatDialog) { }
  idArticle : number = -1;
  article : Article | null;
  modeModal = false;
  dialogRefArticle;
  selectedArticle : Article[];
  listeArticle(page,limit,articleFilter : ArticleFilter, error?): Observable<ListeArticle>
  {
    var param = {...{pager : {page,limit}}, ...{filter :articleFilter}};
    return this.http.post<any>(this.generalService.url + "/liste-article" , param)
    .pipe(catchError(error? error: this.generalService.error))    
  }
  getArticle(id : number, error?): Observable<Article>
  {
    return this.http.get<any>(this.generalService.url + "/find-article/" + id )
    .pipe(catchError(error? error: this.generalService.error))  
  }
  saveArticle(article : Article, error?)
  {
    return this.http.put<any>(this.generalService.url + "/save-article" , article)
    .pipe(catchError(error? error: this.generalService.error))    
  }
}
