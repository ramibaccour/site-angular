import { HttpClient } from "@angular/common/http";
import { GeneralService } from "./general.service";
import { Observable, catchError, of } from "rxjs";
import { Injectable } from "@angular/core";
import { AccueilType } from "../entites/accueilType";
@Injectable({
    providedIn: 'root'
  })
export class AccueilTypeService
{
    constructor(private http: HttpClient,private generalService : GeneralService) { }
    getListeAccueilleType(error?) : Observable<AccueilType[]>
    {
      return this.http.get<any>(this.generalService.url + "/liste-accueille-type")
      .pipe(catchError(error? error: this.generalService.error))  
    }
}