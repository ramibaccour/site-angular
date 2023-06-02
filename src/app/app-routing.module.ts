import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './shared/layout/main/main.component';
import { LoginComponent } from './shared/login/login.component';
import { AccueilleComponent } from './components/accueille/accueille.component';
import { ArticleListeComponent } from './components/article/article-liste/article-liste.component';
import { ArticleFormComponent } from './components/article/article-form/article-form.component';

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
            path: 'ajouter', 
            component: ArticleFormComponent
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
