import { Component, OnInit } from '@angular/core';
import { Accueille } from 'src/app/entites/accueille';
import { GeneralService } from 'src/app/services/general.service';
import { AccueilleService } from 'src/app/services/accueille.service';
import { TypeAccueille } from 'src/app/entites/typeAccueille';
import { TypeAccueilleService } from 'src/app/services/typeAccueille.service';
import { LigneAccueilleFilter } from 'src/app/entites/ligneAccueilleFilter';
import { Header } from 'primeng/api';
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
    private categorieService : CategorieService,
    private accueilleService : AccueilleService,
    private parametreService : ParametreService, 
    private ligneAccueilleService : LigneAccueilleService,
    private typeAccueilleService : TypeAccueilleService){}
  accueille = new Accueille();
  submit = false;
  full_description;
  listeTypeAccueille : TypeAccueille[];
  formData = new FormData();
  image : {src : string, name : string, index: number,file : File | null};
  ligneAccueilleFilter = new LigneAccueilleFilter();
  header : Header;
  listeLigneAccueille : LigneAccueille[];
  fieldsAccueille : Field[] = new Array();
  texte;
  choixSelection:string;
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
    setTimeout(()=>
    {
      this.initQuil()
    },50)
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
    this.typeAccueilleService.getTypeAccueille().subscribe(typeAccueille =>
    {
      this.listeTypeAccueille = typeAccueille;
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
        if(!this.accueille.article)
          this.accueille.article = new Article();
        if(!this.accueille.categorie)
          this.accueille.categorie = new Categorie();
        setTimeout(()=>
        {
          this.initQuil();
          this.setData(this.texte,this.accueille.text)
        },50)
      })   
      this.ligneAccueilleFilter.is_deleted = 0;
      this.ligneAccueilleFilter.id_accueil = this.accueilleService.idAccueille;
      this.getHeadLigneAccueille();   
    }

  }
  modeModale() : boolean
  {
    if(this.accueilleService.idAccueille && this.accueilleService.idAccueille >0)
      return true
    return false
  }
  addLigneAccueille()
  {
    this.ligneAccueilleService.accueille = this.accueille;
    this.ligneAccueilleService.dialogRefLigneAccueille = this.ligneAccueilleService.dialogLigneAccueille.open(LigneAccueilleFormComponent,{height: '80%', width: '80%'    })
    this.ligneAccueilleService.dialogRefLigneAccueille.afterClosed().subscribe(result => 
    {
      this.ligneAccueilleService.accueille = null;
      this.getListeLigneAccueille();
    });
  }
  initQuil()
  {
    if ($("#texte").length)
    {
      if (this.texte instanceof Quill)
        this.destoryQuill('#texte');
      this.texte = new Quill('#texte', 
      {
        theme: 'snow'
      });

    }
  }
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
  getData(quill) : string
  {
    if(quill && quill.root)
      return quill.root.innerHTML;
    return "";
  }
  
  setData(quill,html) 
  {
    if(quill && quill.clipboard)
      quill.clipboard.dangerouslyPasteHTML(html);
  }
  save(form:NgForm)
  {
    this.submit = true;
    // formulaire valide
    if(form.valid && (this.requiredFiled('text') && this.getData(this.texte).length>0 || !this.requiredFiled('text')))
    {
      if(this.modeAdd())
        this.accueille.is_deleted = 0;
      this.accueille.text = this.getData(this.texte)  ;
      var accueille;
      accueille = JSON.parse(JSON.stringify(this.accueille))
      // il y a une image à enregister  
      if (this.formData.has('image'))
      {
        accueille.image = this.image.name;
        var fn = ()=>
        {
          this.formData = new FormData();
        }
        this.generalService.httpPost(this.formData, "/save-image",fn)
      }  
      this.accueilleService.saveAccueille(accueille).subscribe(accueille =>
      {
        if(accueille && accueille.id && accueille.id>0)
        {
          this.generalService.openSnackBar("Enregister",true);        
          this.close();
          this.ligneAccueilleFilter.is_deleted = 0;
          this.ligneAccueilleFilter.id_accueil = accueille.id;
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
        var header = JSON.parse(param.value? param.value : "");
        header.fields = header.fields.filter(field =>{return field.show && field.active});
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
      this.listeLigneAccueille = listeAccueille;
      this.generalService.showSpinner = false;
    })
  }
  action(event)
  {
    if(event.action == "pager" || event.action == "filter")
    {
      event.filterTable.is_deleted = event.filter.is_deleted == true ? "1":  "0";
      this.ligneAccueilleFilter = event.filterTable;
      this.ligneAccueilleFilter.id_accueil = this.accueilleService.idAccueille;
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
    }    
  }
  editLigneAccueille(row)
  {
    this.ligneAccueilleService.accueille = this.accueille;
    this.ligneAccueilleService.ligneAccueille = row;
    this.ligneAccueilleService.dialogRefLigneAccueille = this.ligneAccueilleService.dialogLigneAccueille.open(LigneAccueilleFormComponent,{height: '80%', width: '80%'    })
    this.ligneAccueilleService.dialogRefLigneAccueille.afterClosed().subscribe(result => 
    {
      this.ligneAccueilleService.ligneAccueille = null;
      this.ligneAccueilleService.accueille = null;
      this.getListeLigneAccueille();
    });
  }
  deleteAccueille(event)
  {
    var fn  = ()=>
    {
      this.getListeLigneAccueille();
      var btnDel = event.component.icon == "delete"
      this.generalService.openSnackBar(btnDel? "Supprimer" : "Restaurer",true);
    };
    this.generalService.deleteElement("/delete-ligne-accueille/" + event.row["id"],fn,event.component.icon);
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
      }
      this.categorieService.modeModal = false;
    });
  }
  choixSelectionChange()
  {
    setTimeout(()=>
    {
      this.initQuil()
    },50)
  }
}
