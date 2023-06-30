import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Image } from '../entites/image';

@Injectable({
  providedIn: 'root'
})
export class ImageService 
{
    constructor(private http: HttpClient,private generalService : GeneralService) { }  
    saveImageFile(object,url, fn,error?)
    {
        return this.http.post<any>(this.generalService.url + url, object)
        .pipe(catchError(error? error: ()=>{ return of([]); }))    
        .subscribe(fn);
    }
    saveImage(image : Image, error?)
    {
      var i = JSON.parse(JSON.stringify(image));
      delete i["formData"]
      return this.http.post<any>(this.generalService.url + "/save-image" , i)
      .pipe(catchError(error? error: this.generalService.error))    
    }
}