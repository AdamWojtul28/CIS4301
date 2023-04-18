import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Explore3Component } from './explore3.component';

describe('Explore3Component', () => {
  let component: Explore3Component;
  let fixture: ComponentFixture<Explore3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Explore3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Explore3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
