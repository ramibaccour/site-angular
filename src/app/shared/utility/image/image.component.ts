import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.service';
declare var $;
@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent
{
  @Input() index : number = 0;
  @Input() src : string;
  @Input() submit : boolean = false;
  @Input() required : boolean = false;
  @Input() resolution : {width : number, height : number};
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
  @Output() action = new EventEmitter<{src : string, name : string, index: number}>();
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
      this.resolution = {width : this.listeResolutions[0].width, height : this.listeResolutions[0].height};
    }
  }
  resolutionChange()
  {
    var res = this.listeResolutions.find(r =>{return r.id ==  this.id_resolution});
    if(res)
      this.resolution = {width : res.width, height : res.height};
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
  save() 
  {
    var srcImage = $("#imageOptimiser-"+this.index).attr("src");
    if(this.file && this.file[0] && this.file[0].files && this.file[0].files[0] && this.file[0].files[0].name)
    {
      this.imageChoisie = true;
      this.action.emit({src : srcImage, name : this.generalService.genererChaine(10) + this.file[0].files[0].name, index: this.index})
      this.dialogRef.close();
      this.src = srcImage;
    }
    else
      this.generalService.openSnackBar("Veuillez choisir une image", false);
  }
}
