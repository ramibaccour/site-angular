import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilleComponent } from './accueille.component';

describe('AccueilleComponent', () => {
  let component: AccueilleComponent;
  let fixture: ComponentFixture<AccueilleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccueilleComponent]
    });
    fixture = TestBed.createComponent(AccueilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
