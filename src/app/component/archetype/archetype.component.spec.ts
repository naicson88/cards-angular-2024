import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchetypeComponent } from './archetype.component';

describe('ArchetypeComponent', () => {
  let component: ArchetypeComponent;
  let fixture: ComponentFixture<ArchetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchetypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
