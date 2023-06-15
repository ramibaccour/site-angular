import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LigneAccueilleFormComponent } from './ligne-accueille-form.component';

describe('LigneAccueilleFormComponent', () => {
  let component: LigneAccueilleFormComponent;
  let fixture: ComponentFixture<LigneAccueilleFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LigneAccueilleFormComponent]
    });
    fixture = TestBed.createComponent(LigneAccueilleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
