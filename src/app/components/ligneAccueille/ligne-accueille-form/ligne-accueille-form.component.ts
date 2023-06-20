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
    private parametreService : ParametreService,
    private articleService : ArticleService,
    private categorieService : CategorieService,
    private ligneAccueilleService : LigneAccueilleService){}
  ligneAccueille = new LigneAccueille();
  submit = false;
  formData = new FormData();
  image : {src : string, name : string, index: number,file : File | null};
  fieldsLigneAccueille : Field[] = new Array();
  texte : String;
  choixSelection:string;
  ngOnInit() 
  {
    this.getHeadLigneAccueille();
    // mode ajouter ligne accueille pour accueille
    if(this.ligneAccueilleService.accueille && this.ligneAccueilleService.accueille.id && this.ligneAccueilleService.accueille.id >0)
    {
      this.ligneAccueille.id_accueil =  this.ligneAccueilleService.accueille.id;
    }
  }
  getHeadLigneAccueille()
  {
    this.parametreService.getParametre(4).subscribe(param =>
    {
      var header = JSON.parse(param.value? param.value : "");
      this.fieldsLigneAccueille = header.fields;      
      //mode edit
      if(!this.modeAdd())
      {
        this.getLigneAccueille(this.ligneAccueilleService.ligneAccueille? this.ligneAccueilleService.ligneAccueille.id :0)
      }
      else
      {
          this.ligneAccueille.article = new Article();
          this.ligneAccueille.categorie = new Categorie();
      }
    })
  }
  showFiled(name : string) : boolean
  {
    if(this.fieldsLigneAccueille && this.fieldsLigneAccueille.length>0)
    {
      var myField = this.fieldsLigneAccueille.find(field =>{return field.name == name});
      if(myField && myField.active && myField.listeIdTypeAccueille.find(idType => {return idType == (this.ligneAccueilleService.accueille? this.ligneAccueilleService.accueille.id_accueil_type :-1)}))
        return true;
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
    if(id>0)
      this.ligneAccueilleService.getLigneAccueille(id).subscribe(ligneAccueille =>
      {
        this.ligneAccueille = ligneAccueille;
        if(!this.ligneAccueille.article)
          this.ligneAccueille.article = new Article();
        if(!this.ligneAccueille.categorie)
          this.ligneAccueille.categorie = new Categorie();
        setTimeout(()=>
        {
          this.initQuil();
          this.setData(this.texte,this.ligneAccueille.text)
        },50)
      })
  }
  initQuil()
  {
    if ($("#texte").length )
      this.texte = new Quill('#texte', 
      {
        theme: 'snow'
      });
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
  save()
  {
    var ligneAccueille;
    ligneAccueille = JSON.parse(JSON.stringify(this.ligneAccueille))
    // il y a une image à enregister  
    if (this.formData.has('image'))
    {
      ligneAccueille.image = this.image.name;
      var fn = ()=>
      {
        this.formData = new FormData();
      }
      this.generalService.httpPost(this.formData, "/save-image",fn)
    }
    if(this.modeAdd())
      ligneAccueille.is_deleted = 0;
    this.ligneAccueilleService.saveLigneAccueille(ligneAccueille).subscribe(param =>
    {
      if(param && param.id && param.id>0)
      {
        this.generalService.openSnackBar("Enregister",true);
        
        this.close();
      }
    })
  }
  close()
  {
    if(this.ligneAccueilleService.dialogRefLigneAccueille)
    {
      this.ligneAccueilleService.dialogRefLigneAccueille.close();
      this.ligneAccueilleService.accueille = null;
    }
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
}
