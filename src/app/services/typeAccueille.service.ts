import { HttpClient } from "@angular/common/http";
import { GeneralService } from "./general.service";
import { Observable, catchError, of } from "rxjs";
import { Injectable } from "@angular/core";
import { TypeAccueille } from "../entites/typeAccueille";
@Injectable({
    providedIn: 'root'
  })
export class TypeAccueilleService
{
    constructor(private http: HttpClient,private generalService : GeneralService) { }
    getTypeAccueille(error?) : Observable<TypeAccueille[]>
    {
      return this.http.get<any>(this.generalService.url + "/type-accueille")
      .pipe(catchError(error? error: this.generalService.error))  
    }
}