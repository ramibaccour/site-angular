import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Categorie } from '../entites/categorie';
import { MatDialog } from '@angular/material/dialog';
import { CategorieFilter } from '../entites/categorieFilter';
import { TreeNode } from 'primeng/api';
import { Image } from '../entites/image';
@Injectable({
    providedIn: 'root'
  })
export class CategorieService 
{
    constructor(private http: HttpClient,private generalService : GeneralService,public dialogCategorie: MatDialog) { }
  
    idCategorie : number = -1;
    categorieMode : "Add" | "Update" | null;
    dialogRefCategorie;
    selectedCategorie : Categorie[];
    categorie : Categorie | null;
    modeModal = false;
    listeCategorie(categorieFilter : CategorieFilter,error?): Observable<Categorie[]>
    {
      return this.http.post<any>(this.generalService.url + "/liste-categorie", categorieFilter)
      .pipe(catchError(error? error: this.generalService.error))    
    }
    getCategorie(id : number, error?): Observable<Categorie>
    {
      return this.http.get<any>(this.generalService.url + "/find-categorie/" + id )
      .pipe(catchError(error? error: this.generalService.error))  
    }
    getListeCategorieArticle(id : number, error?): Observable<Categorie[]>
    {
      return this.http.get<any>(this.generalService.url + "/liste-categorie-article/" + id )
      .pipe(catchError(error? error: this.generalService.error))  
    }
    saveCategorie(categorie : Categorie, error?)
    {
      return this.http.put<any>(this.generalService.url + "/save-categorie" , categorie)
      .pipe(catchError(error? error: this.generalService.error))    
    }
    
    getListeImageCategorie(id : number ,error?) : Observable<Image[]>
    {
      return this.http.get<any>(this.generalService.url + "/liste-image-categorie/" + id)
      .pipe(catchError(error? error: this.generalService.error))  
    }
    buildTree(data : Categorie[], id_parent : number | null) : TreeNode[]
    {
      var tree;
      tree = [];
      if(data && data.length>0)
        for (var i = 0; i < data.length; i++) 
        {
          if (data[i].id_parent === id_parent) 
          {
            var node = 
            {
              label: data[i].name,
              data: {id : data[i].id, selected : false},
              children: this.buildTree(data, data[i].id)
            };
            tree.push(node);
          }
        }
      return tree;
    }
}