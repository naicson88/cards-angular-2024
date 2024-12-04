import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSetcollectionComponent } from './user-setcollection.component';

describe('UserSetcollectionComponent', () => {
  let component: UserSetcollectionComponent;
  let fixture: ComponentFixture<UserSetcollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSetcollectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSetcollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
