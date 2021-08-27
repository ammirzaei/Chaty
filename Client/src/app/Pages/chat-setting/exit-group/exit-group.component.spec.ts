import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitGroupComponent } from './exit-group.component';

describe('ExitGroupComponent', () => {
  let component: ExitGroupComponent;
  let fixture: ComponentFixture<ExitGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExitGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
