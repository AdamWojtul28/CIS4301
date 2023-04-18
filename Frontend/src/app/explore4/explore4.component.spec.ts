import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Explore4Component } from './explore4.component';

describe('Explore4Component', () => {
  let component: Explore4Component;
  let fixture: ComponentFixture<Explore4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Explore4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Explore4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
