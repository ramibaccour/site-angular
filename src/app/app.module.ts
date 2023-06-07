import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule} from '@angular/forms';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
//------------------------Begin material----------------------
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from "@angular/material-moment-adapter";
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';   
import {MomentDateModule} from '@angular/material-moment-adapter';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion';
//------------------------End material----------------------
//------------------------Begin Primeng----------------------
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {SidebarModule} from 'primeng/sidebar';
import {PanelMenuModule} from 'primeng/panelmenu';
import {TreeModule} from 'primeng/tree';
import { AccueilleComponent } from './components/accueille/accueille.component';
//------------------------End Primeng----------------------
import { MainComponent } from './shared/layout/main/main.component';
import { TopbarComponent } from './shared/layout/topbar/topbar.component';
import { MenuComponent } from './shared/layout/menu/menu.component';
import { TableComponent } from './shared/utility/table/table.component';
import { DialogComponent } from './shared/utility/dialog/dialog.component';
import { LoginComponent } from './shared/login/login.component';
import { ArticleFormComponent } from './components/article/article-form/article-form.component';
import { ArticleListeComponent } from './components/article/article-liste/article-liste.component';
import { CategorieListeComponent } from './components/categorie/categorie-liste/categorie-liste.component';
import { CategorieFormComponent } from './components/categorie/categorie-form/categorie-form.component';
import { ParametreListeComponent } from './components/parametre/parametre-liste/parametre-liste.component';
import { ParametreFormComponent } from './components/parametre/parametre-form/parametre-form.component';

@NgModule({
  declarations: [
    AppComponent,
    AccueilleComponent,
    MainComponent,
    TopbarComponent,
    MenuComponent,
    TableComponent,
    DialogComponent,
    LoginComponent,
    ArticleFormComponent,
    ArticleListeComponent,
    CategorieListeComponent,
    CategorieFormComponent,
    ParametreListeComponent,
    ParametreFormComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    //------------------------begin material----------------------
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    MatMomentDateModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,  
    MatFormFieldModule,
    MomentDateModule,
    MatPaginatorModule,
    MatExpansionModule,
    //------------------------End material----------------------
    
    //------------------------Begin Primeng----------------------
    OverlayPanelModule,
    SidebarModule,
    PanelMenuModule,
    TreeModule,
    //------------------------End Primeng----------------------

  ],
  providers: 
  [
    // {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    // {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
    {provide : LocationStrategy , useClass: HashLocationStrategy},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
    {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
