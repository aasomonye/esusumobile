import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentLiquidatePage } from './agent-liquidate.page';

describe('AgentLiquidatePage', () => {
  let component: AgentLiquidatePage;
  let fixture: ComponentFixture<AgentLiquidatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentLiquidatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentLiquidatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
