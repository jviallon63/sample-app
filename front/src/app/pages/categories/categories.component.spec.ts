import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { CategoriesComponent } from './categories.component';
import { CategoriesObject } from '../../shared/models/categoriesObject';
import { CategoriesObjectService } from '../../shared/services/categoriesObject.service';
import { NotificationService } from '../../shared/services/notification.service';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let categoriesObjectService: jasmine.SpyObj<CategoriesObjectService>;
  let notifications: jasmine.SpyObj<NotificationService>;

  const categories: CategoriesObject[] = [{ id: 1, name: 'category', description: 'description' }];

  beforeEach(async () => {
    categoriesObjectService = jasmine.createSpyObj('CategoriesObjectService', ['list', 'deleteItem', 'createItem', 'updateItem']);
    notifications = jasmine.createSpyObj('NotificationService', ['success', 'error']);
    categoriesObjectService.list.and.returnValue(of({ count: categories.length, items: categories }));

    await TestBed.configureTestingModule({
      imports: [CategoriesComponent],
      providers: [
        provideHttpClient(),
        provideNoopAnimations(),
        { provide: CategoriesObjectService, useValue: categoriesObjectService },
        { provide: NotificationService, useValue: notifications }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load categories', () => {
    expect(component).toBeTruthy();
    expect(categoriesObjectService.list).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('category');
  });

  it('should notify and reload when a category is removed', () => {
    categoriesObjectService.deleteItem.and.returnValue(of(categories[0]));
    categoriesObjectService.list.calls.reset();

    component.remove(categories[0]);

    expect(categoriesObjectService.deleteItem).toHaveBeenCalledWith(1);
    expect(notifications.success).toHaveBeenCalled();
    expect(categoriesObjectService.list).toHaveBeenCalled();
  });

  it('should notify an error when removal fails', () => {
    categoriesObjectService.deleteItem.and.returnValue(throwError(() => new Error('boom')));

    component.remove(categories[0]);

    expect(notifications.error).toHaveBeenCalledWith('Error while deleting category', 'boom');
  });

  it('should open the form dialog', () => {
    const dialog = TestBed.inject(MatDialog);
    const open = spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as never);
    categoriesObjectService.list.calls.reset();

    component.openCategoryForm(categories[0]);

    expect(open).toHaveBeenCalled();
    expect(categoriesObjectService.list).toHaveBeenCalled();
  });
});
