import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityRaritiesComponent } from './quantity-rarities.component';

describe('QuantityRaritiesComponent', () => {
  let component: QuantityRaritiesComponent;
  let fixture: ComponentFixture<QuantityRaritiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityRaritiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuantityRaritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
