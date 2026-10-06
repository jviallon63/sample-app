import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { ProductsObject } from '../../shared/models/productsObject';

export interface ProductFormData {
  product?: ProductsObject;
  /** Persists the product; the dialog stays open if it errors. */
  save: (product: ProductsObject) => Observable<unknown>;
}

@Component({
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './product-form-dialog.component.html'
})
export class ProductFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<ProductFormDialogComponent, boolean>>(MatDialogRef);
  private readonly data = inject<ProductFormData>(MAT_DIALOG_DATA);

  readonly editMode = !!this.data.product;
  saving = false;

  form = this.fb.group({
    productName: [this.data.product?.name ?? '', Validators.required],
    productDescription: [this.data.product?.description ?? ''],
    productPrice: [this.data.product?.price ?? 0, [Validators.required, Validators.min(0)]],
    productStock: [this.data.product?.stock ?? 0, [Validators.required, Validators.min(0)]]
  });

  saveProduct(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const product: ProductsObject = {
      name: formValue.productName.trim(),
      description: formValue.productDescription?.trim() ?? '',
      price: formValue.productPrice,
      stock: formValue.productStock
    };
    if (this.data.product) {
      product.id = this.data.product.id;
    }

    this.saving = true;
    this.data.save(product).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => (this.saving = false)
    });
  }
}
