import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchersPage } from './vouchers.page';

describe('VouchersPage', () => {
  let component: VouchersPage;
  let fixture: ComponentFixture<VouchersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VouchersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VouchersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
