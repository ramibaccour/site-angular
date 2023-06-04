import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieListeComponent } from './categorie-liste.component';

describe('CategorieListeComponent', () => {
  let component: CategorieListeComponent;
  let fixture: ComponentFixture<CategorieListeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorieListeComponent]
    });
    fixture = TestBed.createComponent(CategorieListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
