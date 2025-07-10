import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsModal } from './statistics-modal';

describe('StatisticsModal', () => {
  let component: StatisticsModal;
  let fixture: ComponentFixture<StatisticsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
