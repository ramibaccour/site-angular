import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/entites/article';
import { Field } from 'src/app/entites/field';
import { Image } from 'src/app/entites/image';
import { Parametre } from 'src/app/entites/parametre';
import { Resolution } from 'src/app/entites/resolution';
import { TypeContent } from 'src/app/entites/typeContent';
import { ArticleService } from 'src/app/services/article.service';
import { GeneralService } from 'src/app/services/general.service';
import { ImageService } from 'src/app/services/image.service';
import { ParametreService } from 'src/app/services/parametre.service';
import { ResolutionsService } from 'src/app/services/resolutions.service';
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
    public imageService : ImageService, 
    private parametreService : ParametreService, 
    private articleService : ArticleService,
    private resolutionsService : ResolutionsService
    ){}
  article = new Article();
  submit = false;
  description;
  full_description;
  parametre : Parametre;
  fields : Field[] = new Array()
  listeResolutions : Resolution[];
  listeImage : Image[] = [];
  ngOnInit() 
  {     
    this.getHeadArticle();
    this.getListeResolution();
    this.getListeImage();
  }
  getListeImage()
  {
    if(!this.modeAdd())
      this.articleService.getListeImageArticle(this.articleService.idArticle).subscribe(images =>
      {
        this.listeImage = images;
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
  ajouterImage()
  {

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
  getListeResolution()
  {
    this.resolutionsService.getListeResolutionByTypeContent(TypeContent.ARTICLE).subscribe(resolution =>
    {
      this.listeResolutions = resolution;
    })
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
  getSrc(image: Image) : string
  {
    if(image.id && image.id>0)
      return this.generalService.urlImage + image.name;
    var src = image.formData.get("image");
    if(src) 
      return src.toString()
    return "";
  }
  modeModale() : boolean
  {
    if(this.articleService.idArticle && this.articleService.idArticle >0)
      return true
    return false
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
      })
  }
  save()
  {
    if(this.modeAdd())
      this.article.is_deleted = 0;
    this.article.description = this.getData(this.description);
    this.article.full_description = this.getData(this.full_description);
    this.saveImage();
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
      this.parametre = param;
      var header = JSON.parse(param.value? param.value : "");
      this.fields = header.fields;
      setTimeout(()=>
      {
        this.initQuil();
        this.getArticle(this.articleService.idArticle);
      },50)
     
    })
  }
  showFiled(name : string) : boolean
  {
    var myField = this.fields.find(field =>{return field.name == name});
    if(myField && myField.active)
      return true;
    return false
  }
}
