import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { AccueilleFilter } from '../entites/accueilleFilter';
import { Accueille } from '../entites/accueille';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AccueilleService
{
    constructor(private http: HttpClient,private generalService : GeneralService,public dialogAccueille: MatDialog) { }
  
    idAccueille : number = -1;
    dialogRefAccueille;
    listeAccueille(accueilleFilter : AccueilleFilter, error?): Observable<Accueille[]>
    {
      return this.http.post<any>(this.generalService.url + "/liste-accueille" , accueilleFilter)
      .pipe(catchError(error? error: this.generalService.error))    
    }
    getAccueille(id : number, error?): Observable<Accueille>
    {
      return this.http.get<any>(this.generalService.url + "/find-accueille/" + id )
      .pipe(catchError(error? error: this.generalService.error))  
    }
    saveAccueille(accueille : Accueille, error?)
    {
      return this.http.put<any>(this.generalService.url + "/save-accueille" , accueille)
      .pipe(catchError(error? error: this.generalService.error))    
    }
  }
  