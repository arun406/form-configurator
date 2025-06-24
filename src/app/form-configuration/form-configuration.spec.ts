import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConfiguration } from './form-configuration';

describe('FormConfiguration', () => {
  let component: FormConfiguration;
  let fixture: ComponentFixture<FormConfiguration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormConfiguration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormConfiguration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
