import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConfigurationDetail } from './form-configuration-detail';

describe('FormConfigurationDetail', () => {
  let component: FormConfigurationDetail;
  let fixture: ComponentFixture<FormConfigurationDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormConfigurationDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormConfigurationDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
