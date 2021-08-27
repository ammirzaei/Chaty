import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditnameGroupComponent } from './editname-group.component';

describe('EditnameGroupComponent', () => {
  let component: EditnameGroupComponent;
  let fixture: ComponentFixture<EditnameGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditnameGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditnameGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
