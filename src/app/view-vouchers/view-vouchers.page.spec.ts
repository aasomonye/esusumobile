import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVouchersPage } from './view-vouchers.page';

describe('ViewVouchersPage', () => {
  let component: ViewVouchersPage;
  let fixture: ComponentFixture<ViewVouchersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewVouchersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVouchersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
