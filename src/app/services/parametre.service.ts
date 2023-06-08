import { HttpClient } from "@angular/common/http";
import { GeneralService } from "./general.service";
import { ParametreFilter } from "../entites/ParametreFilter";
import { Observable, catchError, of } from "rxjs";
import { ListeParametre } from "../entites/ListeParametre";
import { Injectable } from "@angular/core";
import { Parametre } from "../entites/parametre";

@Injectable({
    providedIn: 'root'
  })
export class ParametreService
{
    constructor(private http: HttpClient,private generalService : GeneralService) { }
  
    listeParametre(page,limit,parametreFilter : ParametreFilter, error?): Observable<ListeParametre>
    {
      var param = {...{pager : {page,limit}}, ...{filter :parametreFilter}};
      return this.http.post<any>(this.generalService.url + "/liste-parametre" , param)
      .pipe(catchError(error? error: this.generalService.error))    
    }
    getParametre(id : number, error?) : Observable<Parametre>
    {
      return this.http.get<any>(this.generalService.url + "/find-parametre/" + id )
      .pipe(catchError(error? error: this.generalService.error))  
    }
    saveParametre(parametre : Parametre, error?) : Observable<Parametre>
    {
      return this.http.put<any>(this.generalService.url + "/save-parametre" , parametre)
      .pipe(catchError(error? error: this.generalService.error))    
    }
}