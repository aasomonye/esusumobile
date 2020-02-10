import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBankAccountPage } from './my-bank-account.page';

describe('MyBankAccountPage', () => {
  let component: MyBankAccountPage;
  let fixture: ComponentFixture<MyBankAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBankAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBankAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
