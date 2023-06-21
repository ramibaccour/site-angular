import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { GeneralService } from 'src/app/services/general.service';
declare var $;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent   
{
  constructor(public generalService : GeneralService) { }
  menu: MenuItem[]= 
  [
    {
      label: 'Article',
      icon:'pi pi-fw pi-pencil',
      items: 
      [
          {
              label: 'Ajouter',
              icon:'pi pi-fw pi-align-left',
              routerLink : "/article/formulaire"
              
          },
          {
              label: 'Liste',
              icon:'pi pi-fw pi-align-right',
              routerLink : "/article/liste"
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
              icon:'pi pi-fw pi-align-left',
              routerLink : "/categorie/formulaire"
          },
          {
              label: 'Liste',
              icon:'pi pi-fw pi-align-right',
              routerLink : "/categorie/liste"
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
              icon:'pi pi-fw pi-align-left',
              routerLink : "/accueille/formulaire"
          },
          {
              label: 'Liste',
              icon:'pi pi-fw pi-align-right',
              routerLink : "/accueille/liste"
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
            icon:'pi pi-fw pi-align-right',
            routerLink : "/parametre/liste"
        }
      ]
    }
  ];
}
