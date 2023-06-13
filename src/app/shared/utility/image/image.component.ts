import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.service';
declare var $;
@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit , AfterViewInit{

  data;
  constructor(public dialogRef: MatDialogRef<ImageComponent>,    @Inject(MAT_DIALOG_DATA) data, private generalService : GeneralService) 
  {
    this.data = data;
  }
  file;
  ngOnInit(): void 
  {
  }
  ngAfterViewInit(): void 
  {
    this.file = $("#upphoto").finecrop
    ({
      cropWidth: this.data.width,
      cropHeight: this.data.height,
      cropInput: 'inputImage',
      cropOutput: 'croppedImg',
      zoomValue: 10
    });
  }
  close() 
  {
    this.dialogRef.close();
  }
  save() 
  {
    var srcImage = $("#imageOptimiser").attr("src");
    if(this.file && this.file[0] && this.file[0].files && this.file[0].files[0] && this.file[0].files[0].name)
      this.dialogRef.close({src : srcImage, name : this.file[0].files[0].name});
    else
      this.generalService.openSnackBar("Veuillez choisir une image", false);
  }
}
