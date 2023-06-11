import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilleListeComponent } from './accueille-liste.component';

describe('AccueilleListeComponent', () => {
  let component: AccueilleListeComponent;
  let fixture: ComponentFixture<AccueilleListeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccueilleListeComponent]
    });
    fixture = TestBed.createComponent(AccueilleListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
