import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilleFormComponent } from './accueille-form.component';

describe('AccueilleFormComponent', () => {
  let component: AccueilleFormComponent;
  let fixture: ComponentFixture<AccueilleFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccueilleFormComponent]
    });
    fixture = TestBed.createComponent(AccueilleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
