import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
declare var $;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(public generalService : GeneralService) { }
  setColor
  ngOnInit() 
  {
    
  }
}
