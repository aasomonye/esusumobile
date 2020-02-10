import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundSavingsPage } from './fund-savings.page';

describe('FundSavingsPage', () => {
  let component: FundSavingsPage;
  let fixture: ComponentFixture<FundSavingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundSavingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundSavingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
