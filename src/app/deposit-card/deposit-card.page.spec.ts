import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositCardPage } from './deposit-card.page';

describe('DepositCardPage', () => {
  let component: DepositCardPage;
  let fixture: ComponentFixture<DepositCardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositCardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
