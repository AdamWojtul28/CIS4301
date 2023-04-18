import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Explore5Component } from './explore5.component';

describe('Explore5Component', () => {
  let component: Explore5Component;
  let fixture: ComponentFixture<Explore5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Explore5Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Explore5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
