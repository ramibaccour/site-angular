import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { LigneAccueilleService } from 'src/app/services/ligneAccueille.service';
import { LigneAccueille } from 'src/app/entites/ligneAccueil';
import { ParametreService } from 'src/app/services/parametre.service';
import { Field } from 'src/app/entites/field';
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
    private ligneAccueilleService : LigneAccueilleService){}
  ligneAccueille = new LigneAccueille();
  submit = false;
  formData = new FormData();
  image : {src : string, name : string, index: number,file : File | null};
  fieldsLigneAccueille : Field[] = new Array();
  texte : String;
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
        this.getLigneAccueille(this.ligneAccueilleService.accueille? this.ligneAccueilleService.accueille.id :0)
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
    this.ligneAccueilleService.getLigneAccueille(id).subscribe(ligneAccueille =>
    {
      this.ligneAccueille = ligneAccueille;
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
    else if(this.ligneAccueilleService.accueille && this.ligneAccueilleService.accueille.id && this.ligneAccueilleService.accueille.id >0)
      return false;
    return true;
  }
}
