import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeAheadDemoComponent } from './type-ahead-demo.component';

describe('TypeAheadDemoComponent', () => {
  let component: TypeAheadDemoComponent;
  let fixture: ComponentFixture<TypeAheadDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeAheadDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeAheadDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
