import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateVouchersPage } from './generate-vouchers.page';

describe('GenerateVouchersPage', () => {
  let component: GenerateVouchersPage;
  let fixture: ComponentFixture<GenerateVouchersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateVouchersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateVouchersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
