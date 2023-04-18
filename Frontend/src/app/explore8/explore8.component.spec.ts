import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Explore8Component } from './explore8.component';

describe('Explore8Component', () => {
  let component: Explore8Component;
  let fixture: ComponentFixture<Explore8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Explore8Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Explore8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
