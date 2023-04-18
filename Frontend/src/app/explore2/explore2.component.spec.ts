import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Explore2Component } from './explore2.component';

describe('Explore2Component', () => {
  let component: Explore2Component;
  let fixture: ComponentFixture<Explore2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Explore2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Explore2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
