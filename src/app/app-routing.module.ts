import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './shared/layout/main/main.component';
import { LoginComponent } from './shared/login/login.component';
import { AccueilleComponent } from './components/accueille/accueille.component';
import { ArticleListeComponent } from './components/article/article-liste/article-liste.component';
import { ArticleFormComponent } from './components/article/article-form/article-form.component';
import { CategorieListeComponent } from './components/categorie/categorie-liste/categorie-liste.component';
import { CategorieFormComponent } from './components/categorie/categorie-form/categorie-form.component';
import { ParametreFormComponent } from './components/parametre/parametre-form/parametre-form.component';
import { ParametreListeComponent } from './components/parametre/parametre-liste/parametre-liste.component';

const routes: Routes =
[
  {
    path: '', component: MainComponent,
    children: 
    [
        {
            path: '', 
            pathMatch: 'full',
            redirectTo : "accueille",
        },
        {
            path: 'accueille', 
            component: AccueilleComponent
        }     
    ]
  },
  {
    path: 'article', component: MainComponent,
    children: 
    [
        {
            path: 'liste', 
            component: ArticleListeComponent
        },
        {
            path: 'formulaire', 
            component: ArticleFormComponent
        },
        {
            path: 'formulaire/:id', 
            component: ArticleFormComponent
        }      
    ]
  },
  {
    path: 'parametre', component: MainComponent,
    children: 
    [
        {
            path: 'liste', 
            component: ParametreListeComponent
        },
        {
            path: 'formulaire/:id', 
            component: ParametreFormComponent
        }      
    ]
  },
  {
    path: 'categorie', component: MainComponent,
    children: 
    [
        {
            path: 'liste', 
            component: CategorieListeComponent
        },
        {
            path: 'formulaire', 
            component: CategorieFormComponent
        },
        {
            path: 'formulaire/:id', 
            component: CategorieFormComponent
        }    
    ]
  },
  
  
  {path:'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
