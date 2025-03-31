import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BajnoksagComponent } from './bajnoksag.component';

describe('BajnoksagComponent', () => {
  let component: BajnoksagComponent;
  let fixture: ComponentFixture<BajnoksagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BajnoksagComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BajnoksagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
