import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 4000, panelClass: 'notification-success' });
  }

  error(message: string, detail?: string): void {
    this.snackBar.open(detail ? `${message}: ${detail}` : message, 'Close', {
      duration: 8000,
      panelClass: 'notification-error'
    });
  }
}
