import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinresetPage } from './pinreset.page';

describe('PinresetPage', () => {
  let component: PinresetPage;
  let fixture: ComponentFixture<PinresetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinresetPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinresetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
