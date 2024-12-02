import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckDetailUserComponent } from './deck-detail-user.component';

describe('DeckDetailUserComponent', () => {
  let component: DeckDetailUserComponent;
  let fixture: ComponentFixture<DeckDetailUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckDetailUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckDetailUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
