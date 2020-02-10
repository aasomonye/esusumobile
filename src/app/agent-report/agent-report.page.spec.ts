import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentReportPage } from './agent-report.page';

describe('AgentReportPage', () => {
  let component: AgentReportPage;
  let fixture: ComponentFixture<AgentReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
