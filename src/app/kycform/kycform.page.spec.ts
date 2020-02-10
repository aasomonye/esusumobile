import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycformPage } from './kycform.page';

describe('KycformPage', () => {
  let component: KycformPage;
  let fixture: ComponentFixture<KycformPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycformPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycformPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
