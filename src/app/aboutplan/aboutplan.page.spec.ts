import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutplanPage } from './aboutplan.page';

describe('AboutplanPage', () => {
  let component: AboutplanPage;
  let fixture: ComponentFixture<AboutplanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutplanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutplanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
