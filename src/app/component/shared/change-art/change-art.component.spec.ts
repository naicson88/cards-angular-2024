import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeArtComponent } from './change-art.component';

describe('ChangeArtComponent', () => {
  let component: ChangeArtComponent;
  let fixture: ComponentFixture<ChangeArtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeArtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
