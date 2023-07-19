import { HttpClient } from "@angular/common/http";
import { GeneralService } from "./general.service";
import { Observable, catchError, of } from "rxjs";
import { Injectable } from "@angular/core";
import { ModelAffichage } from "../entites/modelAffichage";

@Injectable({
    providedIn: 'root'
  })
export class ModelAffichageService
{
    constructor(private http: HttpClient,private generalService : GeneralService) { }
    getListeModelAffichage(error?): Observable<ModelAffichage[]>
    {
      return this.http.get<any>(this.generalService.url + "/liste-model_affichage/")
      .pipe(catchError(error? error: this.generalService.error))  
    }
}