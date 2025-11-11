import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForbidenAcessComponent } from './forbiden-acess.component';

describe('ForbidenAcessComponent', () => {
  let component: ForbidenAcessComponent;
  let fixture: ComponentFixture<ForbidenAcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForbidenAcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForbidenAcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
