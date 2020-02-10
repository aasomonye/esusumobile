import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsavingsPage } from './addsavings.page';

describe('AddsavingsPage', () => {
  let component: AddsavingsPage;
  let fixture: ComponentFixture<AddsavingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsavingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsavingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
