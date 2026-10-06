import { Observable } from 'rxjs';

export interface PaginatedResponse<T> {
  count: number;
  items: T[];
}

export interface PaginatorFilters {
  /** 1-based page index */
  page?: number;
  limit?: number;
  /** `field:asc` or `field:desc` */
  sort?: string;
  extraFilters?: Record<string, unknown>;
}

export type PaginatorFetcher<T> = (filters: PaginatorFilters) => Observable<PaginatedResponse<T>>;

export interface Pagination<T> extends PaginatedResponse<T> {
  content: T[];
  pageable: {
    sort: { sorted: boolean; unsorted: boolean; empty: boolean };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  sort: { sorted: boolean; unsorted: boolean; empty: boolean };
  first: boolean;
  size: number;
  // eslint-disable-next-line id-blacklist
  number: number;
  numberOfElements: number;
  empty: boolean;
}
