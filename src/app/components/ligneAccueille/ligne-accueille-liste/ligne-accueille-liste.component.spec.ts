import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LigneAccueilleListeComponent } from './ligne-accueille-liste.component';

describe('LigneAccueilleListeComponent', () => {
  let component: LigneAccueilleListeComponent;
  let fixture: ComponentFixture<LigneAccueilleListeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LigneAccueilleListeComponent]
    });
    fixture = TestBed.createComponent(LigneAccueilleListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
