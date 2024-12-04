import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenencePageComponent } from './maintenence-page.component';

describe('MaintenencePageComponent', () => {
  let component: MaintenencePageComponent;
  let fixture: ComponentFixture<MaintenencePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenencePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenencePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
