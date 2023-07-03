import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Article } from 'src/app/entites/article';
import { Categorie } from 'src/app/entites/categorie';
import { Field } from 'src/app/entites/field';
import { Header } from 'src/app/entites/header';
import { Image } from 'src/app/entites/image';
import { Resolution } from 'src/app/entites/resolution';
import { TypeContent } from 'src/app/entites/typeContent';
import { ArticleService } from 'src/app/services/article.service';
import { CategorieService } from 'src/app/services/categorie.service';
import { GeneralService } from 'src/app/services/general.service';
import { ImageService } from 'src/app/services/image.service';
import { ParametreService } from 'src/app/services/parametre.service';
import { ResolutionsService } from 'src/app/services/resolutions.service';
import { CategorieListeComponent } from '../../categorie/categorie-liste/categorie-liste.component';
import { ActionTable } from 'src/app/entites/actionTable';
import { ArticleCategorieService } from 'src/app/services/articleCategorie.service';
import { ArticleCategorie } from 'src/app/entites/ArticleCategorie';
declare var Quill : any;
@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss']
})
export class ArticleFormComponent implements OnInit 
{
  constructor (
    public generalService : GeneralService, 
    public articleCategorieService : ArticleCategorieService, 
    public imageService : ImageService, 
    private parametreService : ParametreService, 
    private categorieService : CategorieService, 
    private articleService : ArticleService,
    private resolutionsService : ResolutionsService
    ){}
  article = new Article();
  submit = false;
  description;
  full_description;
  fieldsArticle : Field[] = new Array();
  listeResolutions : Resolution[];
  listeImage : Image[] = [];
  initListeImage : Image[] = [];
  initListeCategorie: Categorie[];
  listeCategorie: Categorie[];
  header : Header;
  ngOnInit() 
  {     
    this.getHeadArticle();
    this.getListeResolution();
    this.getListeImage();
    this.getListeCategorie();
    this.getHeadCategorie();
  }
  getHeadCategorie()
  {
    this.parametreService.getParametre(5).subscribe(param =>
    {
      var header = JSON.parse(param.value? param.value : "");
      header.fields = header.fields.filter(field =>{return field.show});
      this.header = header;
    })
  }
  getListeCategorie()
  {
    this.categorieService.getListeCategorieArticle(this.articleService.idArticle).subscribe(listeCategorie =>
    {
      this.listeCategorie = listeCategorie;
      this.initListeCategorie = JSON.parse(JSON.stringify(listeCategorie));
    })
  }
  ajouterCategorie()
  {
    this.categorieService.selectedCategorie = new Array();
    this.categorieService.modeModal = true;
    this.categorieService.dialogRefCategorie = this.categorieService.dialogCategorie.open(CategorieListeComponent,{height: '80%', width: '80%'    })
    this.categorieService.dialogRefCategorie.afterClosed().subscribe(result => 
    {
      if(this.categorieService.selectedCategorie  && this.categorieService.selectedCategorie.length>0)
      {
        this.listeCategorie.push(this.categorieService.selectedCategorie[0]);
      }
      this.categorieService.modeModal = false;
    });  
  }
  actionCategorie(event : ActionTable)
  {
    if(event.action == "cellClick")
    {
      if(event.component.name == "delete")
      {
        this.listeCategorie = this.listeCategorie.filter(cat =>{return cat.id != event.row.id;})
      }
    }  
  }
  getListeImage()
  {
    if(!this.modeAdd())
      this.articleService.getListeImageArticle(this.articleService.idArticle).subscribe(images =>
      {
        this.listeImage = images;
        this.initListeImage = JSON.parse(JSON.stringify(images));
      })
  }
  filterImageByResolution(resolution : Resolution) : Image[]
  {
    if(this.listeImage && this.listeImage.length>0)
      return this.listeImage.filter(image => { return image.id_resolution == resolution.id })
    return new Array()
  }
  actionImage(event)
  {
    if(event.action == "SAVE")
    {
      // image encienne déja existante
      if( event.image && event.image.id && event.image.id > 0)
      { 
        event.image.formData = new FormData();
        event.image.formData.append('image', event.src);
        event.image.formData.append('name', event.name);
        event.image.formData.append('id_image', event.image.id);
      }
      // nouveau image
      else
      {

        if(!this.listeImage || this.listeImage.length < 1)
        {
          this.listeImage = [];
        }
        var image  = new Image();
        image.name = event.name;
        image.id_resolution = event.resolution.id;
        image.ordre = 1;
        image.formData = new FormData();
        image.formData.append('image', event.src);
        image.formData.append('name', event.name);
        image.is_deleted = 0;
        image.id_article = this.article.id;
        if( event.image)
          event.image = image;
        else
          this.listeImage.push(image);

      }      
    }
    if(event.action == "DELETE")
    {
      this.deleteImage(event)
    }
   
  }
  deleteImage(event)
  {
    var fn  = ()=>
    {
      this.listeImage = this.listeImage.filter(image =>{return image.id != event.image.id});
      this.generalService.openSnackBar("Supprimer",true);
    };
    this.generalService.deleteElement("/delete-image/" + event.image["id"],fn,"delete");
  }
  saveImage()
  {
    if(this.listeImage && this.listeImage.length>0)
      this.listeImage.forEach(image =>
      {
        if(image.formData && image.formData.has('image'))
        {
          // encienne image
          if(image.id && image.id > 0)
            image.formData.append("id_image", image.id.toString() )
          else
          {
            this.imageService.saveImage(image).subscribe(myImg =>
            {
              image = myImg;
            })
          }
          var fn = ()=>
          {
            image.formData = new FormData();
          }
          this.imageService.saveImageFile(image.formData, "/save-image-file",fn);
        }
        // recherche d'otre modification
        else 
        {
          var findImage = this.initListeImage.find(img =>{return img.id == image.id});
          if(findImage?.ordre != image.ordre)
            this.imageService.saveImage(image).subscribe(myImg =>
            {
              image = myImg;
            })
        }
      })
  }
  getSrc(image: Image) : string
  {
    if(image.id && image.id>0)
      return this.generalService.urlImage + image.name;
    var src = image.formData.get("image");
    if(src) 
      return src.toString()
    return "";
  }
  getListeResolution()
  {
    this.resolutionsService.getListeResolutionByTypeContent(TypeContent.ARTICLE).subscribe(resolution =>
    {
      this.listeResolutions = resolution;
    })
  }
  save()
  {
    if(this.modeAdd())
      this.article.is_deleted = 0;
    this.article.description = this.getData(this.description);
    this.article.full_description = this.getData(this.full_description);
    if(!this.article.title_seo && this.article.name)
    {
      this.article.title_seo = this.article.name;
    }
    if(!this.article.description_seo && (this.article.description || this.article.full_description))
    {
      this.article.description_seo = this.article.full_description? this.full_description.getText() : this.description.getText() 
    }
    this.article.listeCategorie = this.listeCategorie;
    this.saveImage();
    this.saveCategorie();
    this.articleService.saveArticle(this.article).subscribe(article =>
    {
      if(article && article.id && article.id>0)
      {
        this.generalService.openSnackBar("Enregister",true)
        this.close();
      }
      this.article = new Article();
      this.setData(this.description, "");
      this.setData(this.full_description, "");
    })
  }
  saveCategorie()
  {
    var listeCategorToAdd : ArticleCategorie[] = [];
    var listeCategorToDelete : ArticleCategorie[] = [];
    this.initListeCategorie.forEach(intCat =>
    {
      if(this.listeCategorie.filter(cat =>{ return cat.id == intCat.id}).length == 0)   
        listeCategorToDelete.push({id_article : this.article.id, id_categorie : intCat.id})
    });
    this.listeCategorie.forEach(cat =>
    {
      if(this.initListeCategorie.filter(intCat =>{ return intCat.id == cat.id}).length == 0)   
        listeCategorToAdd.push({ id_article : this.article.id, id_categorie : cat.id})
    });
    if(listeCategorToAdd.length>0)
      this.articleCategorieService.saveListeArticleCategorie(listeCategorToAdd).subscribe(()=>
      {
      });
    if(listeCategorToDelete.length>0)
      this.articleCategorieService.deleteListeArticleCategorie(listeCategorToDelete).subscribe(()=>
      {
      })
  }
  initQuil()
  {
    this.description = new Quill('#description', 
    {
      theme: 'snow'
    });
    this.full_description = new Quill('#full_description', 
    {
      theme: 'snow'
    });
  }
  getArticle(id)
  {
    if(id && id>0)
      this.articleService.getArticle(id).subscribe(art =>
      {
        this.article = art;
        this.setData(this.description, this.article.description)
        this.setData(this.full_description, this.article.full_description)
      })
  }
  getData(quill)
  {
    return quill.root.innerHTML;
  }
  
  setData(quill,html) 
  {
    quill.clipboard.dangerouslyPasteHTML(html);
  }
  modeModale() : boolean
  {
    if(this.articleService.idArticle && this.articleService.idArticle >0)
      return true
    return false
  }
  modeAdd() : boolean
  {
    if(this.article.id && this.article.id>0)
      return false;
    if(this.articleService.idArticle && this.articleService.idArticle >0)
      return false
    return true;
  }
  close()
  {
    if(this.articleService.dialogRefArticle)
      this.articleService.dialogRefArticle.close();
  }
  getHeadArticle()
  {
    this.parametreService.getParametre(1).subscribe(param =>
    {
      var header = JSON.parse(param.value? param.value : "");
      this.fieldsArticle = header.fields;
      setTimeout(()=>
      {
        this.initQuil();
        this.getArticle(this.articleService.idArticle);
      },50)
     
    })
  }
  showFiled(name : string) : boolean
  {
    var myField = this.fieldsArticle.find(field =>{return field.name == name});
    if(myField && myField.active)
      return true;
    return false
  }
}
