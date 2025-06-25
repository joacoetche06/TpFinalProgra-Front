import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSessionComponent } from './confirm-session.component';

describe('ConfirmSessionComponent', () => {
  let component: ConfirmSessionComponent;
  let fixture: ComponentFixture<ConfirmSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
