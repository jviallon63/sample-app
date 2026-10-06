import { Component, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Observable, tap } from 'rxjs';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table/data-table.component';
import { PaginatorFetcher } from '../../shared/models/pagination';
import { ProductsObject } from '../../shared/models/productsObject';
import { NotificationService } from '../../shared/services/notification.service';
import { ProductsObjectService } from '../../shared/services/productsObject.service';
import { ProductFormData, ProductFormDialogComponent } from './product-form-dialog.component';

@Component({
  templateUrl: 'product.component.html',
  imports: [DataTableComponent, MatButtonModule, MatIconModule]
})
export class ProductComponent {
  private readonly productsObjectService = inject(ProductsObjectService);
  private readonly notifications = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  private readonly table = viewChild.required(DataTableComponent<ProductsObject>);

  fetcher: PaginatorFetcher<ProductsObject> = (filters) => this.productsObjectService.list(filters);
  columns: TableColumn<ProductsObject>[] = [
    { key: 'name', header: 'Name', cell: (item) => item.name, sortable: true },
    { key: 'description', header: 'Description', cell: (item) => item.description },
    { key: 'price', header: 'Price', cell: (item) => String(item.price), sortable: true },
    { key: 'stock', header: 'Stock', cell: (item) => String(item.stock), sortable: true }
  ];

  /**
   * Delete the specified item
   *
   * @param item Item to delete
   */
  remove(item: ProductsObject): void {
    this.productsObjectService.deleteItem(item.id).subscribe({
      next: () => {
        this.notifications.success('Item suppressed successfully!');
        this.table().reload();
      },
      error: (err) => this.notifications.error(`Error while deleting ${item.name}`, err.message)
    });
  }

  /**
   * Open the product form dialog; pass a product to edit it, or omit to create a new one
   */
  openProductForm(product?: ProductsObject): void {
    const data: ProductFormData = { product, save: (value) => this.save(value) };
    this.dialog
      .open(ProductFormDialogComponent, { width: '650px', data })
      .afterClosed()
      .subscribe((saved) => {
        if (saved) {
          this.table().reload();
        }
      });
  }

  private save(product: ProductsObject): Observable<unknown> {
    const request$ = product.id
      ? this.productsObjectService.updateItem(product.id, product)
      : this.productsObjectService.createItem(product);

    return request$.pipe(
      tap({
        next: () => this.notifications.success(product.id ? 'Product updated successfully!' : 'Product created successfully!'),
        error: (err) => this.notifications.error('Error while saving product', err.message)
      })
    );
  }
}
