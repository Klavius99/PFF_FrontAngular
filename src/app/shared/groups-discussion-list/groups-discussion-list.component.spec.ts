import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsDiscussionListComponent } from './groups-discussion-list.component';

describe('GroupsDiscussionListComponent', () => {
  let component: GroupsDiscussionListComponent;
  let fixture: ComponentFixture<GroupsDiscussionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsDiscussionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupsDiscussionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
