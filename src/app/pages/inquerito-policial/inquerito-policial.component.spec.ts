import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InqueritoPolicialComponent } from './inquerito-policial.component';

describe('InqueritoPolicialComponent', () => {
  let component: InqueritoPolicialComponent;
  let fixture: ComponentFixture<InqueritoPolicialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InqueritoPolicialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InqueritoPolicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
