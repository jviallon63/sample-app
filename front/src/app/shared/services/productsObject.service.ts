import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EnvConfigurationService } from './envconf.service';
import { ProductsObject } from '../models/productsObject';
import { Pagination, PaginatedResponse, PaginatorFilters } from '../models/pagination';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsObjectService {
  endpoint = `${EnvConfigurationService.configuration.BACKEND_URL}${EnvConfigurationService.configuration.BACKEND_SUB_PATH}/products`;

  /**
   * Constructor
   *
   * @param http httpClient
   *  @param apiService apiService
   */
  constructor(private readonly http: HttpClient, private readonly apiService: ApiService) {}

  /**
   * This method is used to fetch a paginated list of ProductsObject from a specific API endpoint.
   * The `paginatorFilters` parameter is optional and can be used to pass additional pagination criteria.
   *
   * @param paginatorFilters? Pagination filters for the API request.
   * @returns An Observable of PaginatedResponse of ProductsObject.
   */
  list(paginatorFilters?: PaginatorFilters): Observable<PaginatedResponse<ProductsObject>> {
    return this.http
      .get<PaginatedResponse<ProductsObject>>(`${this.endpoint}${this.apiService.getQueryParams(paginatorFilters)}`)
      .pipe(map((items: Pagination<ProductsObject>) => this.getPaginatedResponse(items)));
  }

  /**
   * This method fetches a specific ProductsObject by ID from the API endpoint.
   *
   * @param id ID of the ProductsObject to fetch.
   * @returns An Observable of ProductsObject.
   */
  getItem(id: number, paginatorFilters?: PaginatorFilters): Observable<ProductsObject> {
    return this.http.get<ProductsObject>(`${this.endpoint}/${id}`);
  }

  /**
   * This method posts a new ProductsObject to the API endpoint.
   *
   * @param item The ProductsObject to create.
   * @returns An Observable of ProductsObject.
   */
  createItem(item: ProductsObject): Observable<ProductsObject> {
    return this.http.post<ProductsObject>(`${this.endpoint}`, item);
  }

  updateItem(id: number, item: ProductsObject): Observable<ProductsObject> {
    return this.http.put<ProductsObject>(`${this.endpoint}/${id}`, item);
  }
  /**
   * This method sends a delete request for a specific ProductsObject by ID to the API endpoint.
   *
   * @param id ID of the ProductsObject to delete.
   * @returns An Observable of ProductsObject.
   */
  deleteItem(id: number): Observable<ProductsObject> {
    return this.http.delete<ProductsObject>(`${this.endpoint}/${id}`);
  }

  /**
   * Get paginated response
   *
   * @param pagination the pagination
   */
  getPaginatedResponse(pagination: Pagination<ProductsObject>): PaginatedResponse<ProductsObject> {
    return {
      count: pagination.totalElements,
      items: pagination.content
    };
  }
}
