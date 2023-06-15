import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { MatDialog } from '@angular/material/dialog';
import { LigneAccueille } from '../entites/ligneAccueil';
import { LigneAccueilleFilter } from '../entites/ligneAccueilleFilter';

@Injectable({
  providedIn: 'root'
})
export class LigneAccueilleService
{
    constructor(private http: HttpClient,private generalService : GeneralService,public dialogAccueille: MatDialog) { }
  
    idLigneAccueille : number = -1;
    dialogRefLigneAccueille;
    listeLigneAccueille(ligneAccueilleFilter : LigneAccueilleFilter, error?): Observable<LigneAccueille[]>
    {
      return this.http.post<any>(this.generalService.url + "/liste-ligne-accueille" , ligneAccueilleFilter)
      .pipe(catchError(error? error: this.generalService.error))    
    }
    getLigneAccueille(id : number, error?): Observable<LigneAccueille>
    {
      return this.http.get<any>(this.generalService.url + "/find-ligne-accueille/" + id )
      .pipe(catchError(error? error: this.generalService.error))  
    }
    saveLigneAccueille(ligneAccueille : LigneAccueille, error?)
    {
      return this.http.put<any>(this.generalService.url + "/save-ligne-accueille" , ligneAccueille)
      .pipe(catchError(error? error: this.generalService.error))    
    }
  }
  