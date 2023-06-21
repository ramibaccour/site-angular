import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
declare var $;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements AfterViewInit {

  constructor(public generalService : GeneralService) { }
  setColor
  ngAfterViewInit() 
  {
    setTimeout(()=>
    {
      this.generalService.setWidthBodyContent()
    },50)
  }
}
