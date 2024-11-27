import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoManagerDashboardComponent } from './info-manager-dashboard.component';

describe('InfoManagerDashboardComponent', () => {
  let component: InfoManagerDashboardComponent;
  let fixture: ComponentFixture<InfoManagerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoManagerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoManagerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
