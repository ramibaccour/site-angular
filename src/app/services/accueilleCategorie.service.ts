import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Accueille } from '../entites/accueille';
import { CategorieAccueille } from '../entites/CategorieAccueille';

@Injectable({
  providedIn: 'root'
})
export class AccueilleCategorieService
{
    constructor(private http: HttpClient,private generalService : GeneralService) { }
    getListeAccueilleByCategorie(id : number, error?): Observable<Accueille[]>
    {
      return this.http.get<any>(this.generalService.url + "/get-liste-accueille-by-categorie/" + id )
      .pipe(catchError(error? error: this.generalService.error))  
    }
    saveListeAccueilleCategorie(listeArticleCategorie : CategorieAccueille[], error?) 
    {
      return this.http.put<any>(this.generalService.url + "/save-liste-categorie-accueil" , listeArticleCategorie)
      .pipe(catchError(error? error: this.generalService.error))    
    }
    deleteListeAccueilleCategorie(listeArticleCategorie : CategorieAccueille[],error?)
    {
        return this.http.post<any>(this.generalService.url + "/delete-liste-categorie-accueil", listeArticleCategorie)
        .pipe(catchError(error? error: this.generalService.error))    
    }
}