/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LinkAdderComponent } from './link-adder.component';

describe('LinkAdderComponent', () => {
  let component: LinkAdderComponent;
  let fixture: ComponentFixture<LinkAdderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkAdderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
