import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatenowPage } from './activatenow.page';

describe('ActivatenowPage', () => {
  let component: ActivatenowPage;
  let fixture: ComponentFixture<ActivatenowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivatenowPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivatenowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
