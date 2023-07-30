import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { MatDialog } from '@angular/material/dialog';
import { ArticleCategorie } from '../entites/ArticleCategorie';
import { ArticleCategorieFilter } from '../entites/articleCategorieFilter';
@Injectable({
  providedIn: 'root'
})
export class ArticleCategorieService 
{
    constructor(private http: HttpClient,private generalService : GeneralService,public dialogArticle: MatDialog) { }
    saveListeArticleCategorie(listeArticleCategorie : ArticleCategorie[], error?) : Observable<ArticleCategorie>
    {
      return this.http.put<any>(this.generalService.url + "/save-liste-article-categorie" , listeArticleCategorie)
      .pipe(catchError(error? error: this.generalService.error))    
    }
    deleteListeArticleCategorie(listeArticleCategorie : ArticleCategorieFilter[],error?)
    {
        return this.http.post<any>(this.generalService.url + "/delete-liste-article-categorie", listeArticleCategorie)
        .pipe(catchError(error? error: this.generalService.error))    
    }
}