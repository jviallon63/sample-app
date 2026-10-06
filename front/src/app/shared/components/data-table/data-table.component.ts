import { Component, computed, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { PaginatorFetcher } from '../../models/pagination';
import { NotificationService } from '../../services/notification.service';
import { PAGINATION_SIZES } from '../../utils/constants';

export interface TableColumn<T> {
  /** Also used as the backend sort field */
  key: string;
  header: string;
  cell: (item: T) => string;
  sortable?: boolean;
}

@Component({
  selector: 'app-data-table',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent<T> implements OnInit {
  private readonly notifications = inject(NotificationService);
  private request?: Subscription;

  columns = input.required<TableColumn<T>[]>();
  fetcher = input.required<PaginatorFetcher<T>>();
  pageSizeOptions = input<number[]>(PAGINATION_SIZES);

  edit = output<T>();
  remove = output<T>();

  protected items = signal<T[]>([]);
  protected total = signal(0);
  protected loading = signal(false);
  protected pageIndex = signal(0);
  protected pageSize = signal(10);
  protected sort = signal<Sort>({ active: '', direction: '' });
  protected displayedColumns = computed(() => [...this.columns().map((column) => column.key), 'actions']);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.request?.unsubscribe());
  }

  ngOnInit(): void {
    this.reload();
  }

  /** Reload the current page, or go back to the first one when `resetPage` is true. */
  reload(resetPage = false): void {
    if (resetPage) {
      this.pageIndex.set(0);
    }
    const { active, direction } = this.sort();
    this.loading.set(true);
    this.request?.unsubscribe();
    this.request = this.fetcher()({
      page: this.pageIndex() + 1,
      limit: this.pageSize(),
      sort: active && direction ? `${active}:${direction}` : undefined
    }).subscribe({
      next: (response) => {
        this.items.set(response.items);
        this.total.set(response.count);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.notifications.error('Error while loading data', err?.message);
      }
    });
  }

  protected onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.reload();
  }

  protected onSort(sort: Sort): void {
    this.sort.set(sort);
    this.reload(true);
  }
}
