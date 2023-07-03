import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Image } from 'src/app/entites/image';
import { GeneralService } from 'src/app/services/general.service';
declare var $;
@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent
{
  @Input() name : string = "Image";
  @Input() index : string = "0";
  @Input() src : string;
  @Input() submit : boolean = false;
  @Input() required : boolean = false;
  @Input() resolution : {id : number, name: string, width : number, height : number};
  @Input() image : Image;
  @Input() width : string = "120px";
  private _listeResolutions;
  @Input() set listeResolutions(listeResolutions: {id : number, name : string, width : number, height : number}[])
  {
    this._listeResolutions = listeResolutions;
    this.initResolution()
  }
  get listeResolutions()
  {
    return this._listeResolutions;
  }
  @Output() action = new EventEmitter<any>();
  id_resolution : number;
  constructor( private generalService : GeneralService, public dialog: MatDialog) {}
  file;
  dialogRef
  @ViewChild('template') templateRef: TemplateRef<any>;
  imageChoisie = false;
  initResolution(): void 
  {
    if(this.listeResolutions && this.listeResolutions.length>0)
    {
      this.id_resolution = this.listeResolutions[0].id;
      this.resolution = this.listeResolutions[0]
    }
  }
  resolutionChange()
  {
    var res = this.listeResolutions.find(r =>{return r.id ==  this.id_resolution});
    if(res)
      this.resolution= res;
  }
  addImage()
  {
    this.dialogRef = this.dialog.open(this.templateRef, {panelClass : "fullscreen-dialog" });
    this.dialogRef.afterOpened().subscribe(result => 
    {
      setTimeout(()=>
      {
        this.initFinecrop();
      },50)
    });
  }
  isRequired() : boolean
  {
    return this.submit && this.required && !this.imageChoisie
  }
  initFinecrop(): void 
  {
    this.file = $("#upphoto-" + this.index).finecrop
    ({
      cropWidth: this.resolution.width,
      cropHeight: this.resolution.height,
      cropInput: 'inputImage-' + this.index,
      cropOutput: 'croppedImg-' + this.index,
      zoomValue: 10,
      index : this.index
    });
  }
  userHaveImage() : boolean
  {
    return this.file && this.file[0] && this.file[0].files && this.file[0].files[0] && this.file[0].files[0].name;
  }
  save() 
  {
    var srcImage = $("#imageOptimiser-"+this.index).attr("src");
    if(this.userHaveImage())
    {
      this.imageChoisie = true;
      this.action.emit({src : srcImage, name : this.generalService.genererChaine(10) + this.file[0].files[0].name, index: this.index, image : this.image, resolution : this.resolution, action : "SAVE"})
      this.dialogRef.close();
      this.src = srcImage;
    }
    else
      this.generalService.openSnackBar("Veuillez choisir une image", false);
  }
  delImage()
  {
    var srcImage = $("#imageOptimiser-"+this.index).attr("src");
    this.action.emit({src : srcImage, name : this.image.name, index: this.index, image : this.image, resolution : this.resolution, action : "DELETE"})
  }
}
