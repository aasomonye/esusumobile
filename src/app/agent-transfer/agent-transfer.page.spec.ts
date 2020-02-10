import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentTransferPage } from './agent-transfer.page';

describe('AgentTransferPage', () => {
  let component: AgentTransferPage;
  let fixture: ComponentFixture<AgentTransferPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentTransferPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentTransferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
