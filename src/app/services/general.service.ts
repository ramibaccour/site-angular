import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../entites/user';
import { DialogComponent } from '../shared/utility/dialog/dialog.component';
// declare var ol;
@Injectable({
  providedIn: 'root'
})
export class GeneralService 
{
  constructor(private sanitized: DomSanitizer, public router: Router, public route: ActivatedRoute, private _snackBar: MatSnackBar,public dialogParametre: MatDialog,public dialogArticle: MatDialog, private http: HttpClient){}
  url = "http://localhost/site-frant/admin/controller.php";
  
  headers;
  user = new User();
  showSpinner;
  selectedElement;
  modeModal = false;
  listeSelectable;
  dialogRef;
  showMenu = true;
  menus;
  leftMenu;
  idArticle : number = -1;
  idParametre : number = -1;
  dialogRefParametre
  dialogRefArticle
  erreur = ()=>
  {
    this.showSpinner = false;
    this.openSnackBar("Erreur Inattendu",false);
  }
  httpPost(object,url, fn,error)
  {
    return this.http.post<any>(this.url + url, object, {headers : this.headers})
    .pipe(catchError(error? error: ()=>{ return of([]); }))    
    .subscribe(fn);
  }
  httpPut(object,url, fn,error)
  {
    return this.http.put<any>(this.url + url, object, {headers : this.headers})
    .pipe(catchError(error? error: ()=>{ return of([]); }))    
    .subscribe(fn);
  }
  httpGet(url, fn,error)
  {
    return this.http.get<any>(this.url + url, {headers : this.headers})
    .pipe(catchError(error? error: ()=>{ return of([]); }))    
    .subscribe(fn);
  }
  httpDelete(url, fn,error)
  {
    return this.http.delete<any>(this.url + url, {headers : this.headers})
    .pipe(catchError(error? error: ()=>{ return of([]); }))    
    .subscribe(fn);
  }
  public tokenExpired(token: string) 
  {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }
  public isEmpty(text)
  {
    return text == undefined || text == null || text == ""
  }
  openSnackBar(message : string,status:boolean, duration = 2000) 
  {
    this._snackBar.open(message,"", {duration:  duration,panelClass : [status ? "success" : "failure"]})
    
  }
  transform(url) 
  {
    return this.sanitized.bypassSecurityTrustResourceUrl(url);
  }
  setFormaDateServer(date :Date): String
  {
    //2022-06-04T07:33:52
    var d = date.getFullYear() + "-";
    d += ((date.getMonth()+1).toString().length == 1? "0" + (date.getMonth()+1) : (date.getMonth()+1)) + "-" ;
    d += (date.getDate().toString().length == 1? "0" +date.getDate() : date.getDate()) + "T" ;
    d += (date.getHours().toString().length == 1? "0" + date.getHours() : date.getHours()) + ":" ;
    d += (date.getMinutes().toString().length == 1? "0" + date.getMinutes() : date.getMinutes()) + ":" ;
    d += (date.getSeconds().toString().length == 1? "0" + date.getSeconds() : date.getSeconds());
    return d;
  }
  getResolvedUrl(route: ActivatedRouteSnapshot): string 
  {
    var str = "/";
    route.pathFromRoot
        .map(v => v.url.map(segment => 
          {
            segment.toString();
            if(segment.toString() != "" && segment.toString()!= null)
              str = str + segment.toString() + "/"
          }).join('/'))
        .join('/');
      if(str.length>1)
      str = str.substring(0,str.length-1)
      return str
  }

  console(obj)
  {
    console.log(obj);
  }
  changeIconDelete(event, header)    
  {
    var header = header.fields.find(h => {return h.name == "action"});
    if(header)
    {
      var btn = header.buttons.find(b =>{return b.name == "delete"});
      if(btn)
      {
        if( event.filter.is_deleted == true )
        {
          btn.icon = "restore";
          btn.label = "Restaurer";
        }
        else
        {
          btn.icon = "delete";
          btn.label = "Supprimer";
        }         
      }
     
    }

  }
  
  toBlob(dataURL : String)
  {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) 
    {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw1 = parts[1];

        return new Blob([raw1], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
  }
  
  redimentionner(image, type,maxWidth ,maxHeight,quality)
  {
    var imageWidth = image.width,
    imageHeight = image.height;
    if (imageWidth > imageHeight) 
    {
        if (imageWidth > maxWidth) 
        {
            imageHeight *= maxWidth / imageWidth;
            imageWidth = maxWidth;
        }
    }
    else 
    {
        if (imageHeight > maxHeight) 
        {
            imageWidth *= maxHeight / imageHeight;
            imageHeight = maxHeight;
        }
    }
    var canvas = document.createElement('canvas');
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    image.width = imageWidth;
    image.height = imageHeight;
    var ctx;
    ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, imageWidth, imageHeight);

    var imageReduit = canvas.toDataURL(type,quality);
    return imageReduit
  }
  
  getMyLocation()
  {
    if (navigator.geolocation) 
    {
        navigator.geolocation.getCurrentPosition((position) =>
        {
          return [position.coords.latitude, position.coords.longitude]
    
        }, (error) =>
        {
          return [0,0];
        });
    }          
    return [0,0];
  }
  error =  ()=>
  {
    this.showSpinner = false;
    this.openSnackBar("Erreur inattendue veuillez réessayer", false)
    return of([]);
  } 
  deleteElement(url,fn,action,error = this.erreur)
  {
    var btnDel = action == "delete"
    const dialogRef = this.dialogParametre.open(DialogComponent,
    {
      data : 
            {
              titre : btnDel? "Suppression" : "Restaurer", 
              text : "Voulez-vous vraiment " + (btnDel? "supprimer" : "restaurer") + " cet élément",
              BtnClose : {text : "Annuler", icon : "cancel_presentation"},
              BtnOk : {text : btnDel? "Supprimer" : "Restaurer", icon : btnDel? "delete" : "restore"}
            }
    })
    dialogRef.afterClosed().subscribe(result => 
    {
      if(result && result == "ok")
      {        
        this.httpDelete(url,fn,error)
      }
    });
  }
  
  setFilter(page,limit,objectFilter ) : HttpParams
  {
    var params = new HttpParams().set('page', page).set('limit', limit).set('listeArticle', "");
    var listePropertiArticle = Object.keys(objectFilter);
    listePropertiArticle.forEach(propertiArticle =>
    {
      if(typeof(objectFilter[propertiArticle]) == "number" || typeof(objectFilter[propertiArticle]) == "string" )
        params = params.append(propertiArticle, objectFilter[propertiArticle])
      else if(this.isTypeDateFilter(objectFilter[propertiArticle]))
      {
        if(objectFilter[propertiArticle] && objectFilter[propertiArticle].start)
          params = params.append("dateDebut", objectFilter[propertiArticle].start.toString());
        if(objectFilter[propertiArticle] && objectFilter[propertiArticle].end)
          params = params.append("dateFin", objectFilter[propertiArticle].end.toString());
      }
      
    });
    return params;
  }
  isTypeDateFilter(object) : boolean
  {
    if(object && object.start && object.end)
      return true;
    return false;
  }
}
