import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutSharedPageComponent } from './layout-shared-page.component';

describe('LayoutSharedPageComponent', () => {
  let component: LayoutSharedPageComponent;
  let fixture: ComponentFixture<LayoutSharedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutSharedPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutSharedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
