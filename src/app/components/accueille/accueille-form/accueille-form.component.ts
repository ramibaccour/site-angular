import { Component, OnInit, ViewChild } from '@angular/core';
import { Accueille } from 'src/app/entites/accueille';
import { GeneralService } from 'src/app/services/general.service';
import { AccueilleService } from 'src/app/services/accueille.service';
import { AccueilType } from 'src/app/entites/accueilType';
import { AccueilTypeService } from 'src/app/services/accueilType.service';
import { LigneAccueilleFilter } from 'src/app/entites/ligneAccueilleFilter';
import { LigneAccueille } from 'src/app/entites/ligneAccueil';
import { ParametreService } from 'src/app/services/parametre.service';
import { LigneAccueilleService } from 'src/app/services/ligneAccueille.service';
import { Field } from 'src/app/entites/field';
import { LigneAccueilleFormComponent } from '../../ligneAccueille/ligne-accueille-form/ligne-accueille-form.component';
import { ArticleService } from 'src/app/services/article.service';
import { ArticleListeComponent } from '../../article/article-liste/article-liste.component';
import { Article } from 'src/app/entites/article';
import { NgForm } from '@angular/forms';
import { CategorieService } from 'src/app/services/categorie.service';
import { CategorieListeComponent } from '../../categorie/categorie-liste/categorie-liste.component';
import { Categorie } from 'src/app/entites/categorie';
import { Header } from 'src/app/entites/header';
import { ImageComponent } from 'src/app/shared/utility/image/image.component';
import { Resolution } from 'src/app/entites/resolution';
import { ImageService } from 'src/app/services/image.service';
import { ActionTable } from 'src/app/entites/actionTable';
import { BaseFilter } from 'src/app/entites/baseFilter';
declare var Quill;
declare var $;
@Component({
  selector: 'app-accueille-form',
  templateUrl: './accueille-form.component.html',
  styleUrls: ['./accueille-form.component.scss']
})
export class AccueilleFormComponent implements OnInit 
{
  constructor (
    private generalService : GeneralService, 
    private articleService : ArticleService,
    private imageService : ImageService,
    private categorieService : CategorieService,
    private accueilleService : AccueilleService,
    private parametreService : ParametreService, 
    private ligneAccueilleService : LigneAccueilleService,
    private typeAccueilleService : AccueilTypeService){}
  accueille = new Accueille();
  submit = false;
  full_description;
  listeAccueilleType : AccueilType[];
  formData = new FormData();
  image : {src : string, name : string, index: number,file : File | null};
  ligneAccueilleFilter = new LigneAccueilleFilter();
  header : Header;
  listeLigneAccueille : LigneAccueille[];
  initListeLigneAccueille : LigneAccueille[];
  fieldsAccueille : Field[] = new Array();
  texte;
  choixSelection:string;
  resolution : Resolution;
  @ViewChild("imageAccueille") imageAccueille : ImageComponent;
  ngOnInit() 
  {
    this.getHeadAccueille();    
    this.getTypeAccueille();  
  }
  getHeadAccueille()
  {
    this.parametreService.getParametre(3).subscribe(param =>
    {
      var header = JSON.parse(param.value? param.value : "");
      this.fieldsAccueille = header.fields;      
      this.getAccueille(this.accueilleService.idAccueille);
    })
  }
  accueilTypeChange()
  {
    this.accueille.article = new Article();
    this.accueille.categorie = new Categorie();
    var type = this.listeAccueilleType.find(type =>{return type.id == this.accueille.id_accueil_type})
    if(type)
    {
      this.resolution = type.resolution;
    }
    // setTimeout(()=>
    // {
    //   this.initQuil()
    // },50)
  }
  getSrc()
  {
    if(this.accueille && this.accueille.image)
      return this.generalService.urlImage + this.accueille.image;
    return "assets/images/add-image.png";
  }
  actionImage(event)
  {
    this.image = event;
    this.formData.append('image', event.src);
    this.formData.append('name', event.name);
  }
  getTypeAccueille()
  {
    this.typeAccueilleService.getListeAccueilleType().subscribe(typeAccueille =>
    {
      this.listeAccueilleType = typeAccueille;
    })
  }
  getAccueille(id)
  {
    //mode update
    if(id && id>0)
    {
      this.accueilleService.getAccueille(id).subscribe(accueille =>
      {
        this.accueille = accueille;
        var type = this.listeAccueilleType.find(type =>{return type.id == this.accueille.id_accueil_type})
        if(type)
        {
          this.resolution = type.resolution
        }
        if(!this.accueille.article)
          this.accueille.article = new Article();
        if(!this.accueille.categorie)
          this.accueille.categorie = new Categorie();
        // setTimeout(()=>
        // {
        //   this.initQuil();
        //   this.setData(this.texte,this.accueille.text)
        // },50)
        var filter;
        filter = {is_deleted : {operator : "=", value : 0}, id_accueil : {operator : "=", value : this.accueilleService.idAccueille}};
        this.ligneAccueilleFilter.filter = filter;
        this.getHeadLigneAccueille();   
      })   
    }

  }
  modeModale() : boolean
  {
    if(this.accueilleService.idAccueille && this.accueilleService.idAccueille >0)
      return true
    return false
  }
  addLigneAccueille(id_parent : number)
  { 
    this.ligneAccueilleService.id_parent = id_parent;
    this.ligneAccueilleService.accueille = this.accueille;
    this.ligneAccueilleService.dialogRefLigneAccueille = this.ligneAccueilleService.dialogLigneAccueille.open(LigneAccueilleFormComponent,{height: '80%', width: '80%'    })
    this.ligneAccueilleService.dialogRefLigneAccueille.afterClosed().subscribe(result => 
    {
      this.ligneAccueilleService.id_parent = -1;
      this.ligneAccueilleService.accueille = new Accueille();
      this.getListeLigneAccueille();
    });
  }
  // initQuil()
  // {
  //   if ($("#texte").length)
  //   {
  //     if ( this.texte == undefined)
  //       // this.destoryQuill('#texte');
  //       this.texte = new Quill('#texte', 
  //       {
  //         theme: 'snow'
  //       });

  //   }
  // }
  destoryQuill(selector)
  {
    if($(selector)[0])
    {
        var content = $(selector).find('.ql-editor').html();
        $(selector).html(content);
        $(selector).siblings('.ql-toolbar').remove();
        $(selector + " *[class*='ql-']").removeClass (function (index, css) {
           return (css.match (/(^|\s)ql-\S+/g) || []).join(' ');
        });
        $(selector + "[class*='ql-']").removeClass (function (index, css) {
           return (css.match (/(^|\s)ql-\S+/g) || []).join(' ');
        });
    }
    else
    {
        console.error('editor not exists');
    }
  }
  // getData(quill) : string
  // {
  //   if(quill && quill.root)
  //     return quill.root.innerHTML;
  //   return "";
  // }
  
  // setData(quill,html) 
  // {
  //   if(quill && quill.clipboard)
  //     quill.clipboard.dangerouslyPasteHTML(html);
  // }
  // checkText() : boolean
  // {
  //   return this.showFiled("text")&&
  //   (
  //     (this.requiredFiled('text') && this.texte.getText().trim() !="" ) || 
  //     !this.requiredFiled('text')
  //   ) ||
  //   !this.showFiled('text')
  // }
  save(form:NgForm)
  {
    this.submit = true;
    // formulaire valide
    if(form.valid)
    {
      if(this.modeAdd())
        this.accueille.is_deleted = 0;
      // this.accueille.text = this.getData(this.texte);      
      var accueille;
      accueille = JSON.parse(JSON.stringify(this.accueille))
      if(this.choixSelection == "2")
      { 
        accueille.name = "";
        accueille.text = "";
        accueille.image = "";
        this.formData = new FormData();
      }
      else if(this.choixSelection == "1")
      {
        accueille.article = new Article();
        accueille.categorie = new Categorie();
        accueille.id_article = null;
        accueille.id_categorie = null;
      }
      // il y a une image à enregister  
      if (this.formData.has('image'))
      {
        accueille.image = this.image.name;
        var fn = ()=>
        {
          this.formData = new FormData();
        }
        this.imageService.saveImageFile(this.formData, "/save-image-file",fn)
      }  

      this.accueilleService.saveAccueille(accueille).subscribe(accueille =>
      {
        this.submit = false;
        if(accueille && accueille.id && accueille.id>0)
        {
          this.generalService.openSnackBar("Enregister",true);        
          this.close();
          var filter;
          filter = {is_deleted : {operator : "=", value : 0}, id_accueil : {operator : "=", value : accueille.id}};
          this.ligneAccueilleFilter.filter = filter
          this.getHeadLigneAccueille();
        }
      })      
    }

  }
  close()
  {
    if(this.accueilleService.dialogRefAccueille)
    {
      this.accueilleService.dialogRefAccueille.close();
      this.accueilleService.idAccueille = -1;
    }
  }
  showFiled(name : string) : boolean
  {
    if(this.fieldsAccueille && this.fieldsAccueille.length>0)
    {
      var myField = this.fieldsAccueille.find(field =>{return field.name == name});
      if(myField && myField.active && myField.listeIdTypeAccueille.find(idType => {return idType == this.accueille.id_accueil_type}))
        return true;
    }    
    return false
  }
  requiredFiled(name : string) : boolean
  {
    if(this.fieldsAccueille && this.fieldsAccueille.length>0)
    {
      var myField = this.fieldsAccueille.find(field =>{return field.name == name});
      if(myField && myField.required)
        return true;
    }    
    return false
  }
  modeAdd() : boolean
  {
    if(this.accueille.id && this.accueille.id>0)
      return false;
    else if(this.accueilleService.idAccueille && this.accueilleService.idAccueille>0)
      return false;
    return true;
  }
  getHeadLigneAccueille()
  {
    this.parametreService.getParametre(4).subscribe(param =>
    {
      if(param && param.id)
      {
        var header : Header = JSON.parse(param.value? param.value : "");
        header.fields = header.fields.filter(field =>{return field.show});
        if(this.accueille.accueilType.sub_type == "LIST")
          var action = header.fields.find(field => {return field.name == "action"});
        if(action)
          action.buttons = action.buttons.filter(a =>{return a.name != "add"});
        this.header = header;
        this.getListeLigneAccueille();
        if(this.showFiled('image'))
        {
          if(this.accueille.text && this.accueille.text)
            this.choixSelection = "1";
          else
          this.choixSelection = "2";
        }
          
      }
    })
  }
  getListeLigneAccueille(setSpinner = true) 
  {
    if(setSpinner)
      this.generalService.showSpinner = true;
    this.ligneAccueilleService.listeLigneAccueille(this.ligneAccueilleFilter).subscribe(listeAccueille =>
    {
      this.initListeLigneAccueille = JSON.parse(JSON.stringify(listeAccueille));
      this.listeLigneAccueille = this.accueille.accueilType.sub_type == 'LIST'? listeAccueille : (this.accueille.accueilType.sub_type == 'LIST_GROUPE'? this.genererListeLigneAccueille(listeAccueille) : listeAccueille);
      this.generalService.showSpinner = false;
    })
  }
  genererListeLigneAccueille(listeLigneAccueille:LigneAccueille[]) : LigneAccueille[]
  {
    var header : Header = JSON.parse(JSON.stringify(this.header));
    var is_deleted = header.fields.find(h =>{return h.name == "is_deleted"});
    if(is_deleted)
      is_deleted.filter.show = false;
    var btn = header.fields.find(h =>{return h.name == "action"});
    if(btn)
      btn.buttons = btn.buttons.filter(b =>{return b.name  == "delete"});
    var liste_accueille:LigneAccueille[] = [];
    listeLigneAccueille.forEach(la =>
    {
      if(!la.id_parent)
      {
        la.ROWEXPAND = 
        {
          data :listeLigneAccueille.filter(l=>{return l.id_parent == la.id}) ,
          header : header
        }  
        liste_accueille.push(la);
      }
    });
    // recherche des element que leur parent n'existe pas pour les affichier
    var lstLigneAccueilleFiltred = listeLigneAccueille.filter(la =>{return la.id_parent});
    lstLigneAccueilleFiltred.forEach(idLigneAccueille => 
    {
      if(listeLigneAccueille.filter(lstLA =>{return lstLA.id == idLigneAccueille.id_parent}).length == 0)
      {
        liste_accueille.push(idLigneAccueille);
      }
    });
    return liste_accueille
  }
  action(event : ActionTable)
  {
    if(event.action == "pager" || event.action == "filter")
    {
      event.filterTable.is_deleted.value = event.filter.is_deleted.value == true ? 1:  0;
      this.ligneAccueilleFilter.filter = event.filterTable;
      this.ligneAccueilleFilter.filter.id_accueil = {value : this.accueilleService.idAccueille, operator : "="};
      if(event.action == "filter" && event.component.name == "is_deleted")
      {
        this.generalService.changeIconDelete(event, this.header)          
      }
      this.getListeLigneAccueille();
      
    }
    if(event.action == "cellClick")
    {
      if(event.component.name == "edit")
      {
        this.editLigneAccueille(event.row)
      }
      if(event.component.name == "delete")
      {
        this.deleteAccueille(event)
      }
      if(event.component.name == "add")
      {
        this.addLigneAccueille(event.row["id"])
      }
    }    
  }
  editLigneAccueille(row)
  {
    this.ligneAccueilleService.accueille = this.accueille;
    this.ligneAccueilleService.ligneAccueille = row;
    this.ligneAccueilleService.dialogRefLigneAccueille = this.ligneAccueilleService.dialogLigneAccueille.open(LigneAccueilleFormComponent,{height: '80%', width: '80%'    })
    this.ligneAccueilleService.dialogRefLigneAccueille.afterClosed().subscribe(result => 
    {
      this.ligneAccueilleService.ligneAccueille = new LigneAccueille();
      this.ligneAccueilleService.accueille = new Accueille();
      this.getListeLigneAccueille();
    });
  }
  deleteAccueille(event)
  {
    var lst : {idList : number[]} = {idList : []};
    if(!event.row.id_parent)
      lst.idList = this.initListeLigneAccueille.filter(la =>{return la.id_parent == event.row.id}).map(la =>{return la.id});
    lst.idList.push(event.row.id);

    var fn  = ()=>
    {
      this.getListeLigneAccueille();
      var btnDel = event.component.icon == "delete"
      this.generalService.openSnackBar(btnDel? "Supprimer" : "Restaurer",true);
    };
    this.generalService.deleteElement("/delete-ligne-accueille", fn,event.component.icon,this.generalService.erreur, lst);
    
  }
  selectArticle()
  {
    this.articleService.selectedArticle = new Array();
    this.articleService.modeModal = true;
    this.articleService.dialogRefArticle = this.articleService.dialogArticle.open(ArticleListeComponent,{height: '80%', width: '80%'    })
    this.articleService.dialogRefArticle.afterClosed().subscribe(result => 
    {
      if(this.articleService.selectedArticle  && this.articleService.selectedArticle.length>0)
      {
        this.accueille.article = this.articleService.selectedArticle[0];
        this.accueille.id_article = this.articleService.selectedArticle[0].id;
        this.accueille.categorie = new Categorie();
        this.accueille.id_categorie = -1;
      }
      this.articleService.modeModal = false;
    });
  }
  selectCategorie()
  {
    this.categorieService.selectedCategorie = new Array();
    this.categorieService.modeModal = true;
    this.categorieService.dialogRefCategorie = this.categorieService.dialogCategorie.open(CategorieListeComponent,{height: '80%', width: '80%'    })
    this.categorieService.dialogRefCategorie.afterClosed().subscribe(result => 
    {
      if(this.categorieService.selectedCategorie  && this.categorieService.selectedCategorie.length>0)
      {
        this.accueille.categorie = this.categorieService.selectedCategorie[0];
        this.accueille.id_categorie = this.categorieService.selectedCategorie[0].id;
        this.accueille.article = new Article();
        this.accueille.id_article = -1;
      }
      this.categorieService.modeModal = false;
    });
  }
  // choixSelectionChange()
  // {
  //   setTimeout(()=>
  //   {
  //     this.initQuil()
  //   },50)
  // }
}
