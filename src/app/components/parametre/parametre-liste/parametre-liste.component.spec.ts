import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametreListeComponent } from './parametre-liste.component';

describe('ParametreListeComponent', () => {
  let component: ParametreListeComponent;
  let fixture: ComponentFixture<ParametreListeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParametreListeComponent]
    });
    fixture = TestBed.createComponent(ParametreListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
