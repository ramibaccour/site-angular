import { Component,OnInit } from '@angular/core';
import { AccueilType } from 'src/app/entites/accueilType';
import { Accueille } from 'src/app/entites/accueille';
import { AccueilleFilter } from 'src/app/entites/accueilleFilter';
import { ActionTable } from 'src/app/entites/actionTable';
import { Categorie } from 'src/app/entites/categorie';
import { Field } from 'src/app/entites/field';
import { Header } from 'src/app/entites/header';
import { Image } from 'src/app/entites/image';
import { Parametre } from 'src/app/entites/parametre';
import { Resolution } from 'src/app/entites/resolution';
import { TypeContent } from 'src/app/entites/typeContent';
import { AccueilTypeService } from 'src/app/services/accueilType.service';
import { AccueilleService } from 'src/app/services/accueille.service';
import { AccueilleCategorieService } from 'src/app/services/accueilleCategorie.service';
import { CategorieService } from 'src/app/services/categorie.service';
import { GeneralService } from 'src/app/services/general.service';
import { ImageService } from 'src/app/services/image.service';
import { ParametreService } from 'src/app/services/parametre.service';
import { ResolutionsService } from 'src/app/services/resolutions.service';
import { AccueilleListeComponent } from '../../accueille/accueille-liste/accueille-liste.component';
import {  CategorieAccueille } from 'src/app/entites/CategorieAccueille';
import { NgForm } from '@angular/forms';
import { ResolutionByContent } from 'src/app/entites/resolutionByContent';
declare var Quill : any;
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
    private accueilleCategorieService:  AccueilleCategorieService,
    private accueilleService : AccueilleService,
    private categorieService : CategorieService,
    private parametreService : ParametreService,
    private resolutionsService : ResolutionsService,
    private typeAccueilleService : AccueilTypeService){}
  categorie = new Categorie();
  submit = false;
  parametre : Parametre;
  fields : Field[] = new Array()
  listeImage : Image[] = [];
  initListeImage : Image[] = [];
  listeResolutionsByTypeContent : ResolutionByContent[];
  listeAccueille : Accueille[];
  initListeAccueille : Accueille[];
  header : Header;
  accueilleFilter = new AccueilleFilter();
  listeTypeAccueille : AccueilType[];
  description;
  ngOnInit() 
  {     
    this.accueilleFilter.is_deleted = 0;
    this.getHeadCategorie();
    this.getListeResolution();
    this.getListeImage();
    this.getHeadAccueille();
  }
  
  getTypeAccueille()
  {
    this.typeAccueilleService.getListeAccueilleType().subscribe(typeAccueille =>
    {
      this.listeTypeAccueille = typeAccueille;
      if(this.header)
      {
        var field = this.header.fields.find(f =>{return f.name == "accueilType.type"});
        if(field && field.filter)
        {
          field.filter.data = typeAccueille.map(type =>{ return {id : type.id?.toString(), name : type.type}});;
        }
      }
      this.getListeAccueilleByCategorie();
    })
  }
  getHeadAccueille()
  {
    this.parametreService.getParametre(13).subscribe(param =>
    {
      if(param && param.id)
      {
        var header = JSON.parse(param.value? param.value : "");
        header.fields = header.fields.filter(field =>{return field.show});
        this.header = header;
        this.getTypeAccueille();
      }
    })
  }
  getListeAccueilleByCategorie()
  {
    this.accueilleCategorieService.getListeAccueilleByCategorie(this.categorieService.idCategorie).subscribe(data =>
    {
      var liste;
      liste = data.map(acceuille =>{return {...acceuille, ...{accueilType : this.listeTypeAccueille.find(t => {return t.id == acceuille.id_accueil_type})}}});
      this.listeAccueille = liste;
      this.initListeAccueille = JSON.parse(JSON.stringify(liste));
    })
  }
  action(event : ActionTable)
  {
    if(event.action == "pager" || event.action == "filter")
    {
      event.filterTable.is_deleted = event.filter.is_deleted == true ? "1":  "0";
      this.accueilleFilter = event.filterTable;
      if(event.action == "filter" && event.component.name == "is_deleted")
      {
        this.generalService.changeIconDelete(event, this.header)          
      }
      this.getListeAccueilleByCategorie()
      
    }
    if(event.component.name == "delete")
    {
      this.listeAccueille = this.listeAccueille.filter(accueille =>{return accueille.id != event.row.id;})
    }
  }
  getHeadCategorie()
  {
    this.parametreService.getParametre(5).subscribe(param =>
    {
      this.parametre = param;
      var header = JSON.parse(param.value? param.value : "");
      this.fields = header.fields;
      setTimeout(()=>
      {
        this.initQuil();
        this.getCategorie(this.categorieService.idCategorie);
      },50)
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
          this.setData(this.description, this.categorie.description)
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
  ajouterAccueil()
  {
    this.accueilleService.selectedAccueille = new Array();
    this.accueilleService.modeModal = true;
    this.accueilleService.dialogRefCategorie = this.categorieService.dialogCategorie.open(AccueilleListeComponent,{height: '80%', width: '80%'    })
    this.accueilleService.dialogRefCategorie.afterClosed().subscribe(() => 
    {
      if(this.accueilleService.selectedAccueille  && this.accueilleService.selectedAccueille.length>0)
      {
        this.listeAccueille.push(this.accueilleService.selectedAccueille[0]);
      }
      this.accueilleService.modeModal = false;
    });  
  }
  
  requiredFiled(name : string) : boolean
  {
    if(this.fields && this.fields.length>0)
    {
      var myField = this.fields.find(field =>{return field.name == name});
      if(myField && myField.required)
        return true;
    }    
    return false
  }
  saveAccueille()
  {
    var listeAccueilleToAdd : CategorieAccueille[] = [];
    var listeAccueilleToDelete : CategorieAccueille[] = [];
    if(this.initListeAccueille)
    {
      this.initListeAccueille.forEach(intCat =>
      {
        if(this.listeAccueille.filter(cat =>{ return cat.id == intCat.id}).length == 0)   
          listeAccueilleToDelete.push({id_accueil :intCat.id , id_categorie : this.categorie.id})
      });
      this.listeAccueille.forEach(cat =>
      {
        if(this.initListeAccueille.filter(intCat =>{ return intCat.id == cat.id}).length == 0)   
          listeAccueilleToAdd.push({ id_accueil : cat.id, id_categorie : this.categorie.id})
      });
      if(listeAccueilleToAdd.length>0)
        this.accueilleCategorieService.saveListeAccueilleCategorie(listeAccueilleToAdd).subscribe(()=>
        {
        });
      if(listeAccueilleToDelete.length>0)
        this.accueilleCategorieService.deleteListeAccueilleCategorie(listeAccueilleToDelete).subscribe(()=>
        {
        })
    }
    
  }
  getData(quill)
  {
    return quill.root.innerHTML;
  }
  setData(quill,html) 
  {
    quill.clipboard.dangerouslyPasteHTML(html);
  }
  
  initQuil()
  {
    this.description = new Quill('#description', 
    {
      theme: 'snow'
    });
  }
  save(form:NgForm)
  {
    this.submit = true;
    // formulaire valide
    if(form.valid )
    {
      if(this.modeAdd())
        this.categorie.is_deleted = 0;
      if(!this.categorie.title_seo && this.categorie.name)
      {
        this.categorie.title_seo = this.categorie.name;
      }
      if(!this.categorie.description_seo && (this.categorie.description))
      {
        this.categorie.description_seo =  this.description.getText() 
      }
     
      this.categorie.description = this.getData(this.description);
      this.saveImage();
      this.saveAccueille();
      this.categorieService.saveCategorie(this.categorie).subscribe(categorie =>
      {
        this.submit = false;
        if(categorie && categorie.id && categorie.id>0)
        {
          this.generalService.openSnackBar("Enregister",true)
          if(this.modeAdd())
          {
            this.categorie = new Categorie();
            this.setData(this.description, "");
            if( this.categorieService.idCategorie>0)
              this.categorie.id_parent = this.categorieService.idCategorie;
          }
          else if(this.modeModale())
            this.close();
        }
      })
    }
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
      this.listeResolutionsByTypeContent = resolution;
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
