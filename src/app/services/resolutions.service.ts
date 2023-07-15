import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { ListeArticle } from '../entites/listeArticle';
import { ArticleFilter } from '../entites/articleFilter';
import { Article } from '../entites/article';
import { MatDialog } from '@angular/material/dialog';
import { Resolution } from '../entites/resolution';
import { TypeContent } from '../entites/typeContent';
import { ResolutionByContent } from '../entites/resolutionByContent';

@Injectable({
  providedIn: 'root'
})
export class ResolutionsService
{
    constructor(private http: HttpClient,private generalService : GeneralService) { }
    getResolutionByIdAccueilType(id : number, error?) : Observable<Resolution[]>
    {
      return this.http.get<any>(this.generalService.url + "/get-resolution-by-id-accueil-type/" + id)
      .pipe(catchError(error? error: this.generalService.error))  
    }
    getListeResolutionByTypeContent(type_content : TypeContent, error?) : Observable<ResolutionByContent[]>
    {
      return this.http.get<any>(this.generalService.url + "/get-resolution-by-type-content/" + type_content.toString())
      .pipe(catchError(error? error: this.generalService.error))  
    }
}