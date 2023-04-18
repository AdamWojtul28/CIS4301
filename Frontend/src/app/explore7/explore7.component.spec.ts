import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Explore7Component } from './explore7.component';

describe('Explore7Component', () => {
  let component: Explore7Component;
  let fixture: ComponentFixture<Explore7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Explore7Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Explore7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
