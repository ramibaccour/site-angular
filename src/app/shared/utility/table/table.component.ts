import { Component, Input, OnInit, Output,  EventEmitter, ViewEncapsulation  } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import * as moment from 'moment';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit 
{
  constructor(private sanitized: DomSanitizer) { }
  disabledBtnNext : boolean = false;
  disabledBtnPreview : boolean = false;
  isInisialisedTabSize = false;
  mediaQuery;
  detailVisibility;
  timerFilter;
  @Input() index = 0;
  @Output() action = new EventEmitter<any>()
  @Input() set pager(value)
  {
    this._pager = value;
    this.initTabSize()
  }
  get pager()
  {
      return this._pager;
  }
  @Input() set data(value) 
  {
    this._data = value;
    this.initDetailVisibility();
    this.initTabSize()
    this.setSelectedElement()
  } 
  get data()
  {
    return this._data;
  }
  @Input() set header(value) 
  {
    this._header = value;
    this.sortHeader();
    this.onResized({target : {innerWidth : window.innerWidth}});
  }
  @Input() set footer(value) 
  {
    this._footer = value;
    this.sortFooter();
  }
  get footer()
  {
    return this._footer;
  }
  get header()
  {
      return this._header;
  }
  private _footer
  private _data
  private _header
  private _pager
  tabSize;
  listBtnPage;
  responsiveSwitcher = true;
  localPager = {page :0,size : 0};
  selectedElement;
  ngOnInit(): void 
  {
    if(this.pager)
    {
      this.tabSize = this.pager.tabSize;      
    }
      
    this.onResized({target : {innerWidth : window.innerWidth}})
  }
  initTabSize()
  {
    var tab;
    tab = []
    if(this.tabSize && this.pager.tabSize.length >1 && this.pager)
    {
      tab.push(this.pager.tabSize[0]);
      for(var i=1; i<this.pager.tabSize.length;i++)
      {
        if(this.pager.tabSize[i]<this.pager.count)
          tab.push(this.pager.tabSize[i]);
      } 
      this.tabSize = tab;
    }

  }
  initDetailVisibility()
  {
    this.detailVisibility = {};
    if(this.data)
      for(var i= 0; i< this.data.length;i++)
      {
        this.detailVisibility[i] = false;
      }
  }
  
  onResized(event)
  {
    if(this.header && this.header.breakpoint >= event.target.innerWidth)
      this.responsiveSwitcher = false;
    else
      this.responsiveSwitcher = true;

  }
  sortHeader()
  {
      if(this.header && this.header.fields)
        this.header.fields.sort((b, a) => b.order > a.order ? 1 : -1)
  }
  sortFooter()
  {
      if(this.footer && this.footer.fields)
        this.footer.fields.sort((b, a) => b.order > a.order ? 1 : -1)
  }
  filter(name : string, action : string)
  {
    if(this.timerFilter)
    {
      clearTimeout(this.timerFilter);
      this.setTimerFilter(name, action)
    }
    else
      this.setTimerFilter(name, action)
    
  }
  filterdate(field)
  {
    if(field.filter.value.start && field.filter.value.end)
    {
      try
      {
        var start = field.filter.value.start.toDate(); // pour tester field.filter.value.start.toDate() 
        var end = field.filter.value.end.toDate(); // field.filter.value.end.toDate();
        this.filter(field.label,"filter")
      }
      catch
      {
        try
        {
          field.filter.value.end = moment(field.filter.value.end)  // field.filter.value.end.toDate();
          this.filter(field.label,"filter")
        }
        catch
        {

        }
      }
    }
  }
  viderDate(field)
  {
    field.filter.value = {start : "", end : ""};
    this.filter(field.label,"filter")
  }
  pageChange(event)
  {
    this.pager.page = event.pageIndex
    this.pager.size = event.pageSize
    this.filter("","pager")    
  }
  setSelectedElement()
  {
    if(this.selectedElement && this.data && this.header && (this.header.selectable  == 'list' || this.header.selectable  == 'unique'))
      this.data.forEach(element => 
      {
        var findElement = this.selectedElement.find(ee => 
        {
          var a = JSON.parse(JSON.stringify(ee));
          if(a.SELECTABLE)
            delete a.SELECTABLE
          return JSON.stringify(a) == JSON.stringify(element)
        })
        if(findElement )
        {
          element["SELECTABLE"] = true
        }
      });
  }
  getPager()
  {

    if(this.pager)    
      return this.pager; 
    else
      return {}
  }
  getFilter(setPager = true)
  {
    var rObj = {};
    this.header.fields.map( field => 
    {
      if(field.filter)
      {
        // rObj[field.name] = field.filter.value;
        if(field.filter.type != "date")
          rObj[field.filter.returnProperty? field.filter.returnProperty : field.name] = field.filter.value;
        else
        {
          if(field.filter.value.start && field.filter.value.end)
          {
            rObj[field.filter.returnProperty? field.filter.returnProperty : field.name] ={start: this.setFormaDateServer(new Date (field.filter.value.start)), end: this.setFormaDateServer(new Date (field.filter.value.end))} ;
          }
          else
          {
            rObj[field.filter.returnProperty? field.filter.returnProperty : field.name] ={start:"",end : ""};
          }
        }         
      }
      
    });
    if(setPager)
      return Object.assign(rObj,this.getPager());
    return rObj;
    
  }
  showFilter()
  {
    return this.header.fields.reduce((previousValue, currentValue) => previousValue || (currentValue.filter? currentValue.filter.show: false),false);
  }
  setTimerFilter(name : string, action : string)
  {
    this.timerFilter = setTimeout(() => 
    {
      if(this.pager && action == "filter")
        this.pager.page = 0;
      this.action.emit(
      {
        action : action,
        component : name,
        filter : this.getFilter(),
        filterTable : this.getFilter(false)
      }); 
    }, 700);
  }
  customSelectSerarch(field)
  {
    this.action.emit(
      {
        action : "customSelectSerarch",
        component : field,
        filter : this.getFilter(),
        filterTable : this.getFilter(false)
      }); 
  }
  cellClick(buttonAction, row)
  {
    this.action.emit(
    {
      action : "cellClick",
      component : buttonAction,
      filter : this.getFilter(),
      filterTable : this.getFilter(false),
      row : row
    }); 
  }
  sortClick(field, direction)
  {
    if(direction == "asc")
      field.direction = "desc"
    if(direction == "desc")
      field.direction = ""
    if(direction == "")
      field.direction = "asc"
    this.action.emit(
    {
      action : "sortClick",
      component : field,
      filterTable : this.getFilter(false),
      filter : this.getFilter(),
      direction : field.direction
    }); 
  }
  selectableCheckboxChange(row,action, index)
  {
    if(!this.selectedElement)
      this.selectedElement = [];
    var valueSelect = row["SELECTABLE"] && true;
    if(action == "unique")
      this.data.forEach(d => 
      {
        d["SELECTABLE"] = false;
      });
    row["SELECTABLE"] = valueSelect;
    this.data[index]["SELECTABLE"] = row["SELECTABLE"];
    //this.selectedElement = this.data.filter(element => {return element["SELECTABLE"] == true})
    this.data.forEach(element => 
    {
      var findElement = this.selectedElement.find(ee => {return JSON.stringify(ee) == JSON.stringify(element)})
      if(findElement )
      {
        if(element["SELECTABLE"] == false)
          this.selectedElement = this.selectedElement.filter(ee => {return JSON.stringify(ee) != JSON.stringify(findElement)});
      }
      else if(element["SELECTABLE"] == true)
        this.selectedElement.push(element);
    });
    this.action.emit(
    {
      index,
      action : action,
      filterTable : this.getFilter(false),
      filter : this.getFilter(),
      row : row,
      selectedElement : this.selectedElement
    }); 
  }
  
  emitAction(event)
  {
    this.action.emit(event)
  }
  transform(value) 
  {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
  checkHaveExpandeRow() : boolean
  {
    
    if(this.data && this.data.length>0 )
    {
      var test = this.data.filter(element => 
      {
        var el =  element["ROWEXPAND"]
        return el != undefined
      })
      if(test.length > 0)
        return true
    }
      
    return false
  }
  getNamePropty(property : string, row )
  {
    var tab = property.split(".")
    if(tab && tab.length>1)
    {
      var p = "row." + property;
      try
      {
        var rs = eval(p);
        if(rs != null && rs != undefined)
          return rs;
        else
          return ""
      }
      catch
      {
        return "";
      }

    }
    else
    {
      var rs = row[property];
      if(rs != null && rs != undefined)
          return rs;
      else
          return ""
      return 
    }
  }
  setFormaDateServer(date :Date): String
  {
    var d = date.getFullYear() + "-";
    d += ((date.getMonth()+1).toString().length == 1? "0" + (date.getMonth()+1) : (date.getMonth()+1)) + "-" ;
    d += (date.getDate().toString().length == 1? "0" +date.getDate() : date.getDate()) + "T" ;
    d += (date.getHours().toString().length == 1? "0" + date.getHours() : date.getHours()) + ":" ;
    d += (date.getMinutes().toString().length == 1? "0" + date.getMinutes() : date.getMinutes()) + ":" ;
    d += (date.getSeconds().toString().length == 1? "0" + date.getSeconds() : date.getSeconds());
    return d;
  }
  console(obj)
  {
    console.log(obj);
  }
  getStyleTable()
  {
    if(this.header.height)
      return {height : this.header.height? this.header.height : 'auto','overflow-y' : 'auto'};
    else
      return {};
  }
  getNumberCol(numberCol)
  {
    var tab;
    tab = [];
    for(var i=0; i<numberCol; i++)
      tab.push("");
    return tab
  }
  getStyleFieldsResponsive(field)
  {
    var style;
    if(field.minWidth && field.width)
     style= {'min-width': this.responsiveSwitcher ? field.minWidth  :'100%','width':this.responsiveSwitcher ? field.width :'100%'};
    else if(!this.responsiveSwitcher)
      style= {'min-width': '100%','width':'100%'};
    else
      style = {}
    if(field.style)
    {
       var s = {...field.style,...style}
      return s
    }
    else return style;
    
  }
}
