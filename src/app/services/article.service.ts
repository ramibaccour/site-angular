import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';
import { ListeArticle } from '../entites/listeArticle';
import { ArticleFilter } from '../entites/articleFilter';

@Injectable({
  providedIn: 'root'
})
export class ArticleService 
{

  constructor(private http: HttpClient,private generalService : GeneralService) { }
  
  listeArticle(page,limit,articleFilter : ArticleFilter, error?): Observable<ListeArticle>
  {
    var param = {...{pager : {page,limit}}, ...{filter :articleFilter}};
    return this.http.post<any>(this.generalService.url + "/liste-article" , param)
    .pipe(catchError(error? error: ()=>{ return of([]); }))    
  }
  getArticle(id : number, error?)
  {
    return this.http.get<any>(this.generalService.url + "/find-article/" + id )
    .pipe(catchError(error? error: ()=>{ return of([]); }))  
  }
}
