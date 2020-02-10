import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuicksavePage } from './quicksave.page';

describe('QuicksavePage', () => {
  let component: QuicksavePage;
  let fixture: ComponentFixture<QuicksavePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuicksavePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuicksavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
