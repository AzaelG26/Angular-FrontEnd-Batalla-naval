import { ComponentFixture, TestBed } from '@angular/core/testing';

import { layoutComponent } from './layout';

describe('Dashboard', () => {
  let component: layoutComponent;
  let fixture: ComponentFixture<layoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [layoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(layoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
