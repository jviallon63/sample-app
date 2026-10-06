import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ProductComponent } from './product.component';
import { ProductsObject } from '../../shared/models/productsObject';
import { NotificationService } from '../../shared/services/notification.service';
import { ProductsObjectService } from '../../shared/services/productsObject.service';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let productsObjectService: jasmine.SpyObj<ProductsObjectService>;
  let notifications: jasmine.SpyObj<NotificationService>;

  const products: ProductsObject[] = [{ id: 1, name: 'product', description: 'description', price: 10, stock: 100 }];

  beforeEach(async () => {
    productsObjectService = jasmine.createSpyObj('ProductsObjectService', ['list', 'deleteItem', 'createItem', 'updateItem']);
    notifications = jasmine.createSpyObj('NotificationService', ['success', 'error']);
    productsObjectService.list.and.returnValue(of({ count: products.length, items: products }));

    await TestBed.configureTestingModule({
      imports: [ProductComponent],
      providers: [
        provideHttpClient(),
        provideNoopAnimations(),
        { provide: ProductsObjectService, useValue: productsObjectService },
        { provide: NotificationService, useValue: notifications }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load products', () => {
    expect(component).toBeTruthy();
    expect(productsObjectService.list).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('product');
  });

  it('should notify and reload when a product is removed', () => {
    productsObjectService.deleteItem.and.returnValue(of(products[0]));
    productsObjectService.list.calls.reset();

    component.remove(products[0]);

    expect(productsObjectService.deleteItem).toHaveBeenCalledWith(1);
    expect(notifications.success).toHaveBeenCalled();
    expect(productsObjectService.list).toHaveBeenCalled();
  });

  it('should notify an error when removal fails', () => {
    productsObjectService.deleteItem.and.returnValue(throwError(() => new Error('boom')));

    component.remove(products[0]);

    expect(notifications.error).toHaveBeenCalledWith('Error while deleting product', 'boom');
  });

  it('should open the form dialog', () => {
    const dialog = TestBed.inject(MatDialog);
    const open = spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as never);
    productsObjectService.list.calls.reset();

    component.openProductForm(products[0]);

    expect(open).toHaveBeenCalled();
    expect(productsObjectService.list).toHaveBeenCalled();
  });
});
