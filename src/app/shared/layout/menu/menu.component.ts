import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { GeneralService } from 'src/app/services/general.service';
declare var $;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit 
{
  constructor(public generalService : GeneralService) { }
  menu: MenuItem[];
  ngOnInit(): void 
  {
    this.menu = 
    [
      {
        label: 'Article',
        icon:'pi pi-fw pi-pencil',
        items: 
        [
            {
                label: 'Ajouter',
                icon:'pi pi-fw pi-align-left'
            },
            {
                label: 'Liste',
                icon:'pi pi-fw pi-align-right',
                routerLink : "article/liste"
            }
        ]
      },
      {
        label: 'Catégorie',
        icon:'pi pi-fw pi-pencil',
        items: 
        [
            {
                label: 'Ajouter',
                icon:'pi pi-fw pi-align-left'
            },
            {
                label: 'Liste',
                icon:'pi pi-fw pi-align-right'
            }
        ]
      },
      {
        label: 'Accueil',
        icon:'pi pi-fw pi-pencil',
        items: 
        [
            {
                label: 'Ajouter',
                icon:'pi pi-fw pi-align-left'
            },
            {
                label: 'Liste',
                icon:'pi pi-fw pi-align-right'
            }
        ]
      },
      {
        label: 'Paramétre',
        icon:'pi pi-fw pi-pencil',
        items: 
        [            
            {
                label: 'Liste',
                icon:'pi pi-fw pi-align-right'
            }
        ]
      }
    ]
  }
  
  getParentNode()
  {
    return this.generalService.leftMenu.filter(menu => { return this.generalService.isEmpty(menu.idParent)} )
  }
  getSubParentNode(menuParent)
  {
    return this.generalService.leftMenu.filter(menu =>  {return menuParent.id == menu.idParent})
  }
  goToMenu(menu)
  {
    if(this.getSubParentNode(menu).length == 0)
    {
      this.generalService.leftMenu.forEach(m => 
      {
        m.selected = false;
      });
      menu.selected = true;      
    }
    else
      menu.open = !menu.open
    if(menu.routerLink && menu.routerLink.length>0)
    {
      this.generalService.router.navigate(menu.routerLink)

    }    
  }
}
