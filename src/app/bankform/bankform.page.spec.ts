import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankformPage } from './bankform.page';

describe('BankformPage', () => {
  let component: BankformPage;
  let fixture: ComponentFixture<BankformPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankformPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankformPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
