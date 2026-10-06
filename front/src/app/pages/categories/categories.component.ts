import { Component, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Observable, tap } from 'rxjs';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table/data-table.component';
import { CategoriesObject } from '../../shared/models/categoriesObject';
import { PaginatorFetcher } from '../../shared/models/pagination';
import { CategoriesObjectService } from '../../shared/services/categoriesObject.service';
import { NotificationService } from '../../shared/services/notification.service';
import { CategoryFormData, CategoryFormDialogComponent } from './category-form-dialog.component';

@Component({
  templateUrl: 'categories.component.html',
  imports: [DataTableComponent, MatButtonModule, MatIconModule]
})
export class CategoriesComponent {
  private readonly categoriesObjectService = inject(CategoriesObjectService);
  private readonly notifications = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  private readonly table = viewChild.required(DataTableComponent<CategoriesObject>);

  fetcher: PaginatorFetcher<CategoriesObject> = (filters) => this.categoriesObjectService.list(filters);
  columns: TableColumn<CategoriesObject>[] = [
    { key: 'name', header: 'Name', cell: (item) => item.name, sortable: true },
    { key: 'description', header: 'Description', cell: (item) => item.description }
  ];

  /**
   * Delete the specified item
   *
   * @param item Item to delete
   */
  remove(item: CategoriesObject): void {
    this.categoriesObjectService.deleteItem(item.id).subscribe({
      next: () => {
        this.notifications.success('Item suppressed successfully!');
        this.table().reload();
      },
      error: (err) => this.notifications.error(`Error while deleting ${item.name}`, err.message)
    });
  }

  /**
   * Open the category form dialog; pass a category to edit it, or omit to create a new one
   */
  openCategoryForm(category?: CategoriesObject): void {
    const data: CategoryFormData = { category, save: (value) => this.save(value) };
    this.dialog
      .open(CategoryFormDialogComponent, { width: '650px', data })
      .afterClosed()
      .subscribe((saved) => {
        if (saved) {
          this.table().reload();
        }
      });
  }

  private save(category: CategoriesObject): Observable<unknown> {
    const request$ = category.id
      ? this.categoriesObjectService.updateItem(category.id, category)
      : this.categoriesObjectService.createItem(category);

    return request$.pipe(
      tap({
        next: () => this.notifications.success(category.id ? 'Category updated successfully!' : 'Category created successfully!'),
        error: (err) => this.notifications.error('Error while saving category', err.message)
      })
    );
  }
}
