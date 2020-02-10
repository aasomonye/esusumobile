import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositVoucherPage } from './deposit-voucher.page';

describe('DepositVoucherPage', () => {
  let component: DepositVoucherPage;
  let fixture: ComponentFixture<DepositVoucherPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositVoucherPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositVoucherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
