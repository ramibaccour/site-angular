import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';
import { User } from '../entites/user';
@Injectable({
  providedIn: 'root'
})
export class UserService 
{
  constructor(private http: HttpClient,private generalService : GeneralService) { }
  
  erreur = ()=>
  {
    this.generalService.showSpinner = false;
    return of([]);
  }
  signin(user : User,error?): Observable<User>
  {
    return this.http.post<any>(this.generalService.url,{...{signin : ""}, ...user} )
    .pipe(catchError(error? error: this.generalService.erreur))    
  }
  httpPost(user : User,error?): Observable<User>
  {
    return this.http.post<any>(this.generalService.url, user, {headers : this.generalService.headers})
    .pipe(catchError(error? error: ()=>{ return of([]); }))    
  }
  httpPut(object,url, fn,error)
  {
    return this.http.put<any>(this.generalService.url + url, object, {headers : this.generalService.headers})
    .pipe(catchError(error? error: ()=>{ return of([]); }))    
    .subscribe(fn);
  }
  httpGet(url,error?): Observable<User[]>
  {
    return this.http.get<User>(this.generalService.url + url, {headers : this.generalService.headers})
    .pipe(catchError(error? error: ()=>{ return of([]); }))    
  }
  httpDelete(url, fn,error)
  {
    return this.http.delete<any>(this.generalService.url + url, {headers : this.generalService.headers})
    .pipe(catchError(error? error: ()=>{ return of([]); }))    
    .subscribe(fn);
  }
}
