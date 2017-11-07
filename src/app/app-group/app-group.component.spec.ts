import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGroupComponent } from './app-group.component';

describe('AppGroupComponent', () => {
  let component: AppGroupComponent;
  let fixture: ComponentFixture<AppGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
