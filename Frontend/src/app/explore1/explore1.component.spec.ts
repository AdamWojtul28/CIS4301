import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Explore1Component } from './explore1.component';

describe('Explore1Component', () => {
  let component: Explore1Component;
  let fixture: ComponentFixture<Explore1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Explore1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Explore1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
