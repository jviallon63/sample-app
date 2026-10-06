import { Injectable } from '@angular/core';
import { PaginatorFilters } from '../models/pagination';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  /**
   * Get query params
   *
   * @param paginatorFilters the paginator filters
   */
  getQueryParams(paginatorFilters: PaginatorFilters): string {
    let queryParams = '';
    if (paginatorFilters) {
      queryParams += this.handlePagination(paginatorFilters);
      if (paginatorFilters.extraFilters) {
        queryParams += this.handleExtraFilters(paginatorFilters);
      }
      if (queryParams.length) {
        queryParams = `?${queryParams.substring(1)}`;
      }
    }
    return queryParams;
  }

  /**
   * Handle Pagination
   *
   * @param paginatorFilters filters
   * @returns  query string
   */
  handlePagination(paginatorFilters: PaginatorFilters) {
    let res = '';
    if (paginatorFilters.page) {
      res += `&page=${paginatorFilters.page - 1}`;
    }
    if (paginatorFilters.limit) {
      res += `&size=${paginatorFilters.limit}`;
    }
    if (paginatorFilters.sort) {
      res += `&sort=${paginatorFilters.sort.replace(':', ',')}`;
    }
    return res;
  }

  /**
   * Handle extra filters
   *
   * @param paginatorFilters filters
   * @returns  query string
   */
  handleExtraFilters(paginatorFilters: PaginatorFilters) {
    let res = '';
    Object.entries(paginatorFilters.extraFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        for (const str of value) {
          if (str) {
            if (str instanceof Date) {
              res += `&${key}=${str.toISOString()}`;
            } else {
              res += `&${key}=${str}`;
            }
          }
        }
      } else {
        res += `&${key}=${value}`;
      }
    });
    return res;
  }
}
