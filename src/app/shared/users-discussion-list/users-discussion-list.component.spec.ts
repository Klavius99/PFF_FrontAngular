import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDiscussionListComponent } from './users-discussion-list.component';

describe('UsersDiscussionListComponent', () => {
  let component: UsersDiscussionListComponent;
  let fixture: ComponentFixture<UsersDiscussionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersDiscussionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersDiscussionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
