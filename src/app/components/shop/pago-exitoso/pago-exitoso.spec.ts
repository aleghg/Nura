import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoExitosoComponent } from '../../shop/pago-exitoso/pago-exitoso';

describe('PagoExitoso', () => {
  let component: PagoExitosoComponent;
  let fixture: ComponentFixture<PagoExitosoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoExitosoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoExitosoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
