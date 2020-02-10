import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneformPage } from './phoneform.page';

describe('PhoneformPage', () => {
  let component: PhoneformPage;
  let fixture: ComponentFixture<PhoneformPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneformPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneformPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
