import { Component,OnInit } from '@angular/core';
import { Categorie } from 'src/app/entites/categorie';
import { Field } from 'src/app/entites/field';
import { Image } from 'src/app/entites/image';
import { Parametre } from 'src/app/entites/parametre';
import { Resolution } from 'src/app/entites/resolution';
import { TypeContent } from 'src/app/entites/typeContent';
import { CategorieService } from 'src/app/services/categorie.service';
import { GeneralService } from 'src/app/services/general.service';
import { ImageService } from 'src/app/services/image.service';
import { ParametreService } from 'src/app/services/parametre.service';
import { ResolutionsService } from 'src/app/services/resolutions.service';

@Component({
  selector: 'app-categorie-form',
  templateUrl: './categorie-form.component.html',
  styleUrls: ['./categorie-form.component.scss']
})
export class CategorieFormComponent implements OnInit 
{
  constructor (
    public imageService : ImageService, 
    private generalService : GeneralService, 
    private categorieService : CategorieService,
    private parametreService : ParametreService,
    private resolutionsService : ResolutionsService){}
  categorie = new Categorie();
  submit = false;
  parametre : Parametre;
  fields : Field[] = new Array()
  listeImage : Image[] = [];
  initListeImage : Image[] = [];
  listeResolutions : Resolution[];
  ngOnInit() 
  {     
    this.getHeadCategorie();
    this.getListeResolution();
    this.getListeImage();
  }
  getHeadCategorie()
  {
    this.parametreService.getParametre(5).subscribe(param =>
    {
      this.parametre = param;
      var header = JSON.parse(param.value? param.value : "");
      this.fields = header.fields;
      this.getCategorie(this.categorieService.idCategorie);
    })
  }
  getCategorie(id)
  {
    if(!this.modeAdd())
    {
      if(id && id>0)
        this.categorieService.getCategorie(id).subscribe(categorie =>
        {
          this.categorie = categorie;
        })

    }
    else if( this.categorieService.idCategorie>0)
      this.categorie.id_parent = this.categorieService.idCategorie;
  }
  modeModale() : boolean
  {
    if(this.categorieService.idCategorie && this.categorieService.idCategorie >0)
      return true
    return false
  }
  save()
  {
    if(this.modeAdd())
      this.categorie.is_deleted = 0;
    if(!this.categorie.title_seo && this.categorie.name)
    {
      this.categorie.title_seo = this.categorie.name;
    }
    if(!this.categorie.description_seo && this.categorie.name)
    {
      this.categorie.description_seo = this.categorie.name;
    }
    this.saveImage();
    this.categorieService.saveCategorie(this.categorie).subscribe(categorie =>
    {
      if(categorie && categorie.id && categorie.id>0)
      {
        this.generalService.openSnackBar("Enregister",true)
        if(this.modeAdd())
        {
          this.categorie = new Categorie();
          if( this.categorieService.idCategorie>0)
            this.categorie.id_parent = this.categorieService.idCategorie;
        }
        else if(this.modeModale())
          this.close();
      }
    })
  }
  modeAdd() : boolean
  {
    if(!this.modeModale())
    {
      if(this.categorie.id && this.categorie.id>0)
        return false;
      return true;
    }
    if(this.categorieService.categorieMode == 'Update')
      return false;
    return true;
  }
  close()
  {
    if(this.categorieService.dialogRefCategorie)
      this.categorieService.dialogRefCategorie.close();
  }
  showFiled(name : string) : boolean
  {
    var myField = this.fields.find(field =>{return field.name == name});
    if(myField && myField.active)
      return true;
    return false
  }
  getListeResolution()
  {
    this.resolutionsService.getListeResolutionByTypeContent(TypeContent.CATEGORIE).subscribe(resolution =>
    {
      this.listeResolutions = resolution;
    })
  }
  getListeImage()
  {
    if(!this.modeAdd())
      this.categorieService.getListeImageCategorie(this.categorieService.idCategorie).subscribe(images =>
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
        image.id_categorie = this.categorie.id;
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
}
