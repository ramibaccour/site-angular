import { HttpClient, HttpParams } from '@angular/common/http';
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
    var param = {...{pager : {page,limit}}, ...{filter :articleFilter}, ...{listeArticle : ""}};
    return this.http.post<any>(this.generalService.url , param)
    .pipe(catchError(error? error: ()=>{ return of([]); }))    
  }
  setFilter(page,limit,articleFilter : ArticleFilter) : HttpParams
  {
    var params = new HttpParams().set('page', page).set('limit', limit).set('listeArticle', "");
    var listePropertiArticle = Object.keys(articleFilter);
    listePropertiArticle.forEach(propertiArticle =>
    {
      if(typeof(articleFilter[propertiArticle]) == "number" || typeof(articleFilter[propertiArticle]) == "string" )
        params = params.append(propertiArticle, articleFilter[propertiArticle])
      else if(this.isTypeDateFilter(articleFilter[propertiArticle]))
      {
        if(articleFilter[propertiArticle] && articleFilter[propertiArticle].start)
          params = params.append("dateDebut", articleFilter[propertiArticle].start.toString());
        if(articleFilter[propertiArticle] && articleFilter[propertiArticle].end)
          params = params.append("dateFin", articleFilter[propertiArticle].end.toString());
      }
      
    });
    return params;
  }
  isTypeDateFilter(object) : boolean
  {
    if(object && object.start && object.end)
      return true;
    return false;
  }
}
