import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { LigneAccueilleService } from 'src/app/services/ligneAccueille.service';
import { LigneAccueille } from 'src/app/entites/ligneAccueil';
import { ParametreService } from 'src/app/services/parametre.service';
import { Field } from 'src/app/entites/field';
import { ArticleService } from 'src/app/services/article.service';
import { CategorieService } from 'src/app/services/categorie.service';
import { CategorieListeComponent } from '../../categorie/categorie-liste/categorie-liste.component';
import { ArticleListeComponent } from '../../article/article-liste/article-liste.component';
import { Categorie } from 'src/app/entites/categorie';
import { Article } from 'src/app/entites/article';
import { NgForm } from '@angular/forms';
import { ResolutionsService } from 'src/app/services/resolutions.service';
import { ImageService } from 'src/app/services/image.service';
declare var $;
declare var Quill;
@Component({
  selector: 'app-ligne-accueille-form',
  templateUrl: './ligne-accueille-form.component.html',
  styleUrls: ['./ligne-accueille-form.component.scss']
})
export class LigneAccueilleFormComponent implements OnInit 
{
  constructor (
    private generalService : GeneralService, 
    private imageService : ImageService, 
    private parametreService : ParametreService,
    private articleService : ArticleService,
    private categorieService : CategorieService,
    private resolutionsService : ResolutionsService,
    private ligneAccueilleService : LigneAccueilleService){}
  ligneAccueille = new LigneAccueille();
  submit = false;
  formData = new FormData();
  image : {src : string, name : string, index: number,file : File | null};
  fieldsLigneAccueille : Field[] = new Array();
  texte;
  choixSelection: "1" | "2";
  listeResolutions : {id : number, name : string, width : number, height : number}[];
  nullValue;
  ngOnInit() 
  {
    this.getHeadLigneAccueille();
    // mode ajouter ligne accueille pour accueille
    if(this.ligneAccueilleService.accueille && this.ligneAccueilleService.accueille.id && this.ligneAccueilleService.accueille.id >0)
    {
      this.ligneAccueille.id_accueil =  this.ligneAccueilleService.accueille.id;
    }
    if(this.ligneAccueilleService.id_parent && this.ligneAccueilleService.id_parent >0)
    {
      this.ligneAccueille.id_parent =  this.ligneAccueilleService.id_parent;
    }
    this.getResolutionByIdAccueilType();
  }
  getResolutionByIdAccueilType()
  {
    this.resolutionsService.getResolutionByIdAccueilType(this.ligneAccueilleService.accueille.accueilType.id).subscribe(listeResolution =>
    {
      this.listeResolutions = listeResolution.map(r =>
      {
        return {name : r.width + " / " + r.height, id : r.id, width : r.width, height:r.height}
      })
    })
  }
  getHeadLigneAccueille()
  {
    this.parametreService.getParametre(4).subscribe(param =>
    {
      var header = JSON.parse(param.value? param.value : "");
      this.fieldsLigneAccueille = header.fields;     
      setTimeout(()=>
      {
        this.initQuil();
        //mode edit
        if(!this.modeAdd())
        {
          this.getLigneAccueille(this.ligneAccueilleService.ligneAccueille.id);
        }
      },50) 
      //mode add      
      if(this.modeAdd())
      {
          this.ligneAccueille.article = new Article();
          this.ligneAccueille.categorie = new Categorie();
      }
    })
  }
  showFiledName(name : string) : string
  {
    if(this.fieldsLigneAccueille && this.fieldsLigneAccueille.length>0)
    {
      var myField = this.fieldsLigneAccueille.find(field =>{return field.name == name});
      if(myField)
        return myField.label;
    }
    return "";
  }
  getFiled(name : string) : Field
  {
    if(this.fieldsLigneAccueille && this.fieldsLigneAccueille.length>0)
    {
      var myField = this.fieldsLigneAccueille.find(field =>{return field.name == name});
      if(myField)
        return myField;
    }
    return new Field();
  }
  requiredFiled(name : string) : boolean
  {
    if(this.fieldsLigneAccueille && this.fieldsLigneAccueille.length>0)
    {
      var myField = this.fieldsLigneAccueille.find(field =>{return field.name == name});
      if(myField && myField.required)
        return true;
    }    
    return false
  }
  showFiled(name : string) : boolean
  {
    if(this.fieldsLigneAccueille && this.fieldsLigneAccueille.length>0)
    {
      var myField = this.fieldsLigneAccueille.find(field =>{return field.name == name});
      if(myField && myField.active )
      {
        if(this.ligneAccueilleService.accueille.accueilType.sub_type == "LIST" ||
        (this.ligneAccueilleService.accueille.accueilType.sub_type == "LIST_GROUPE" && this.ligneAccueilleService.id_parent > 0))
        {
          if(myField.listeIdTypeAccueille.find(idType => {return idType == (this.ligneAccueilleService.accueille? this.ligneAccueilleService.accueille.id_accueil_type :-1)}))
            return true;
        }
        else if(this.ligneAccueilleService.accueille.accueilType.sub_type == "LIST_GROUPE")
        {
          if(myField.listeIdTypeAccueilleForParent.find(idType => {return idType == (this.ligneAccueilleService.accueille? this.ligneAccueilleService.accueille.id_accueil_type :-1)}))
            return true;
        }
      }
        
    }    
    return false
  }
  getSrc()
  {
    if(this.ligneAccueille && this.ligneAccueille.image)
      return this.generalService.urlImage + this.ligneAccueille.image;
    return "assets/images/add-image.png";
  }
  actionImage(event)
  {
    this.image = event;
    this.formData.append('image', event.src);
    this.formData.append('name', event.name);
  }  
  getLigneAccueille(id)
  {
    if(id && id>0)
      this.ligneAccueilleService.getLigneAccueille(id).subscribe(ligneAccueille =>
      {
        this.ligneAccueille = ligneAccueille;
        if(!this.ligneAccueille.article)
          this.ligneAccueille.article = new Article();
        if(!this.ligneAccueille.categorie)
          this.ligneAccueille.categorie = new Categorie();
        this.setData(this.texte,this.ligneAccueille.text) ;
        if(this.ligneAccueille.name && this.ligneAccueille.name.length>0)        
        {
          this.choixSelection = '1';
          this.choixSelectionChange()
        }
        else
          this.choixSelection = '1'

      })
  }
  initQuil()
  {
    if ($("#texte").length)
    {
      if (this.texte == undefined)
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
  getData(quill)
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
    if(
      form.valid && 
      (
        (this.showFiled('text') && (this.requiredFiled('text') && this.texte.getText().trim()!="" || !this.requiredFiled('text'))) ||
        !this.showFiled('text')
      ))
    {
      var ligneAccueille;
      this.ligneAccueille
      this.ligneAccueille.text = this.getData(this.texte);
      ligneAccueille = JSON.parse(JSON.stringify(this.ligneAccueille))
      // il y a une image à enregister  
      if (this.formData.has('image'))
      {
        ligneAccueille.image = this.image.name;
        var fn = ()=>
        {
          this.formData = new FormData();
        }
        this.imageService.saveImageFile(this.formData, "/save-image-file",fn)
      }
      if(this.modeAdd())
        ligneAccueille.is_deleted = 0;
      if(this.choixSelection == "2")
      { 
        ligneAccueille.name = "";
        ligneAccueille.text = "";
        ligneAccueille.image = "";
        this.formData = new FormData();
      }
      else if(this.choixSelection == "1")
      {
        ligneAccueille.article = new Article();
        ligneAccueille.categorie = new Categorie();
        ligneAccueille.id_article = null;
        ligneAccueille.id_categorie = null;
      }
      this.ligneAccueilleService.saveLigneAccueille(ligneAccueille).subscribe(param =>
      {
        this.submit = false;
        if(param && param.id && param.id>0)
        {
          this.generalService.openSnackBar("Enregister",true);
          
          this.close();
        }
      })
    }
    
  }
  close()
  {
    if(this.ligneAccueilleService.dialogRefLigneAccueille)
      this.ligneAccueilleService.dialogRefLigneAccueille.close();
  }
  modeAdd() : boolean
  {
    if(this.ligneAccueille.id && this.ligneAccueille.id>0)
      return false;
    else if(this.ligneAccueilleService.ligneAccueille && this.ligneAccueilleService.ligneAccueille.id && this.ligneAccueilleService.ligneAccueille.id >0)
      return false;
    return true;
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
        this.ligneAccueille.article = this.articleService.selectedArticle[0];
        this.ligneAccueille.id_article = this.articleService.selectedArticle[0].id;
        this.ligneAccueille.id_categorie = this.nullValue;
        this.ligneAccueille.categorie = new Categorie();
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
        this.ligneAccueille.categorie = this.categorieService.selectedCategorie[0];
        this.ligneAccueille.id_categorie = this.categorieService.selectedCategorie[0].id;
        this.ligneAccueille.article = new Article();
        this.ligneAccueille.id_article = this.nullValue;
      }
      this.categorieService.modeModal = false;
    });
  }
  choixSelectionChange()
  {
    setTimeout(()=>
    {
      this.initQuil();
      if(this.ligneAccueille)
        this.setData(this.texte,this.ligneAccueille.text);
    },50)
  }
}
