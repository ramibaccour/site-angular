import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Tree, TreeModule } from 'primeng/tree';
import { CheckboxModule } from 'primeng/checkbox';
import { Categorie } from 'src/app/entites/categorie';
import { CategorieService } from 'src/app/services/categorie.service';
import { ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { GeneralService } from 'src/app/services/general.service';
import { CategorieFormComponent } from '../categorie-form/categorie-form.component';
import { CategorieFilter } from 'src/app/entites/categorieFilter';
@Component({
  standalone : true,
  imports : [CommonModule,TreeModule,CheckboxModule,FormsModule,MatIconModule,MatButtonModule ],
  selector: 'app-categorie-liste',
  templateUrl: './categorie-liste.component.html',
  styleUrls: ['./categorie-liste.component.scss']
})

export class CategorieListeComponent implements OnInit
{
  constructor (private categorieService : CategorieService, private generalService : GeneralService){}
  categorieTree: TreeNode[];
  @ViewChild('tree', { static: false }) private tree: Tree;
  selectedNode;
  categorieFilter : CategorieFilter = new CategorieFilter();
  ngOnInit(): void 
  {
    this.initCategorieFilter();
    this.getListeCategorie();
  }
  initCategorieFilter()
  {
    var filter;
    filter = {is_deleted : {operator : "=", value : 0}}
    this.categorieFilter.filter = filter; 
    this.categorieFilter.idList = [];
  }
  unselectAllNode(node) 
  {
    node.data.selected = false
    if (node.children) 
    {
      for (let i = 0; i < node.children.length; i++) 
      {
        this.unselectAllNode(node.children[i]); 
      }
    }
  }
  onNodeSelect(event: any) 
  {
    this.categorieTree.forEach(cate => 
    {
      this.unselectAllNode(cate);
    });
    event.node.data.selected = !event.node.data.selected;
    if(this.modeModale())
    {
      var cat = new Categorie();
      cat.id = event.node.data.id;
      cat.name = event.node.label;
      this.categorieService.selectedCategorie = [];
      this.categorieService.selectedCategorie.push(cat);
    }
  }
  openFrmCategorie(categorieMode :"Add" | "Update" | null)
  {
    if(this.categorieService.categorieMode == 'Update' )
    {
      if(!this.selectedNode)
      {
        this.generalService.openSnackBar("Veuillez sélectionner une catégorie",false)
        return;
      }
    }
    this.categorieService.categorieMode = categorieMode;
    if(this.selectedNode && this.selectedNode.data)
      this.categorieService.idCategorie = this.selectedNode.data.id;
    this.categorieService.dialogRefCategorie = this.categorieService.dialogCategorie.open(CategorieFormComponent,{height: '80%', width: '80%'    })
    this.categorieService.dialogRefCategorie.afterClosed().subscribe(result => 
    {
      this.categorieService.idCategorie = -1;
      this.selectedNode = null;
      this.categorieService.categorieMode = null;
      this.getListeCategorie();
    });
    
  }
  modifier()
  {
    this.openFrmCategorie('Update');
  }
  ajouter()
  {
    this.openFrmCategorie('Add');
  }
  close()
  {
    if(this.categorieService.dialogRefCategorie)
      this.categorieService.dialogRefCategorie.close()
  }
  modeModale()
  {
    return this.categorieService.modeModal;
  }
  supprimer()
  {
    if(this.selectedNode)
    {
      this.categorieFilter.idList.push(this.selectedNode.data.id);
      this.findChildNodes(this.selectedNode, this.selectedNode.data.id, this.categorieFilter.idList)
      var fn  = ()=>
      {
        this.initCategorieFilter();
        this.getListeCategorie();
        this.generalService.openSnackBar("Supprimer",true);
      };
      this.generalService.deleteElement("/delete-categorie",fn,"delete",this.generalService.erreur,this.categorieFilter);
    }
    else
    this.generalService.openSnackBar("Veuillez sélectionner une catégorie",false)
  }
  getListeCategorie()
  {
    this.categorieService.listeCategorie(this.categorieFilter).subscribe(data =>
    {
      this.categorieTree = this.categorieService.buildTree(data,null);
    })
  }
  findChildNodes(node, targetNodeId, childNodeList) 
  {
    if (node.data.id === targetNodeId) 
    {
      if (node.children) 
      {
        for (let i = 0; i < node.children.length; i++) 
        {
          childNodeList.push(node.children[i].data.id); // Ajoute chaque enfant à la liste
        }
      }
    } 
    else 
    {
      if (node.children) 
      {
        for (let i = 0; i < node.children.length; i++) 
        {
          const childNode = node.children[i];
          this.findChildNodes(childNode, targetNodeId, childNodeList); // Appel récursif pour chaque enfant
        }
      }
    }
  }
  selectCategorie()
  {
      if(this.categorieService.selectedCategorie && this.categorieService.selectedCategorie.length>0)
        this.close();
      else
        this.generalService.openSnackBar("Veuillez sélectionner un élément",false);
  }
}
