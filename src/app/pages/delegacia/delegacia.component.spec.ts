import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegaciaComponent } from './delegacia.component';

describe('DelegaciaComponent', () => {
  let component: DelegaciaComponent;
  let fixture: ComponentFixture<DelegaciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelegaciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegaciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
