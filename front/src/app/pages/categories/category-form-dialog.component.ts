import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { CategoriesObject } from '../../shared/models/categoriesObject';

export interface CategoryFormData {
  category?: CategoriesObject;
  /** Persists the category; the dialog stays open if it errors. */
  save: (category: CategoriesObject) => Observable<unknown>;
}

@Component({
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './category-form-dialog.component.html'
})
export class CategoryFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<CategoryFormDialogComponent, boolean>>(MatDialogRef);
  private readonly data = inject<CategoryFormData>(MAT_DIALOG_DATA);

  readonly editMode = !!this.data.category;
  saving = false;

  form = this.fb.group({
    categoryName: [this.data.category?.name ?? '', Validators.required],
    categoryDescription: [this.data.category?.description ?? '']
  });

  saveCategory(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const category: CategoriesObject = {
      name: formValue.categoryName.trim(),
      description: formValue.categoryDescription?.trim() ?? ''
    };
    if (this.data.category) {
      category.id = this.data.category.id;
    }

    this.saving = true;
    this.data.save(category).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => (this.saving = false)
    });
  }
}
