import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsinfoPage } from './savingsinfo.page';

describe('SavingsinfoPage', () => {
  let component: SavingsinfoPage;
  let fixture: ComponentFixture<SavingsinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavingsinfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingsinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
