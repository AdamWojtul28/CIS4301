import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Explore6Component } from './explore6.component';

describe('Explore6Component', () => {
  let component: Explore6Component;
  let fixture: ComponentFixture<Explore6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Explore6Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Explore6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
