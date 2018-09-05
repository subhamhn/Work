import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanrequestapprovalComponent } from './loanrequestapproval.component';

describe('LoanrequestapprovalComponent', () => {
  let component: LoanrequestapprovalComponent;
  let fixture: ComponentFixture<LoanrequestapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanrequestapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanrequestapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
