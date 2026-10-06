import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EnvConfigurationService } from './envconf.service';
import { CategoriesObject } from '../models/categoriesObject';
import { Pagination, PaginatedResponse, PaginatorFilters } from '../models/pagination';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesObjectService {
  endpoint = `${EnvConfigurationService.configuration.BACKEND_URL}${EnvConfigurationService.configuration.BACKEND_SUB_PATH}/categories`;

  /**
   * Constructor
   *
   * @param http httpClient
   *  @param apiService apiService
   */
  constructor(private readonly http: HttpClient, private readonly apiService: ApiService) {}

  /**
   * This method is used to fetch a paginated list of CategoriesObject from a specific API endpoint.
   * The `paginatorFilters` parameter is optional and can be used to pass additional pagination criteria.
   *
   * @param paginatorFilters? Pagination filters for the API request.
   * @returns An Observable of PaginatedResponse of CategoriesObject.
   */
  list(paginatorFilters?: PaginatorFilters): Observable<PaginatedResponse<CategoriesObject>> {
    return this.http
      .get<PaginatedResponse<CategoriesObject>>(`${this.endpoint}${this.apiService.getQueryParams(paginatorFilters)}`)
      .pipe(map((items: Pagination<CategoriesObject>) => this.getPaginatedResponse(items)));
  }

  /**
   * This method fetches a specific CategoriesObject by ID from the API endpoint.
   *
   * @param id ID of the CategoriesObject to fetch.
   * @returns An Observable of CategoriesObject.
   */
  getItem(id: number, paginatorFilters?: PaginatorFilters): Observable<CategoriesObject> {
    return this.http.get<CategoriesObject>(`${this.endpoint}/${id}`);
  }

  /**
   * This method posts a new CategoriesObject to the API endpoint.
   *
   * @param item The CategoriesObject to create.
   * @returns An Observable of CategoriesObject.
   */
  createItem(item: CategoriesObject): Observable<CategoriesObject> {
    return this.http.post<CategoriesObject>(`${this.endpoint}`, item);
  }

  updateItem(id: number, item: CategoriesObject): Observable<CategoriesObject> {
    return this.http.put<CategoriesObject>(`${this.endpoint}/${id}`, item);
  }

  /**
   * This method sends a delete request for a specific CategoriesObject by ID to the API endpoint.
   *
   * @param id ID of the CategoriesObject to delete.
   * @returns An Observable of CategoriesObject.
   */
  deleteItem(id: number): Observable<CategoriesObject> {
    return this.http.delete<CategoriesObject>(`${this.endpoint}/${id}`);
  }

  /**
   * Get paginated response
   *
   * @param pagination the pagination
   */
  getPaginatedResponse(pagination: Pagination<CategoriesObject>): PaginatedResponse<CategoriesObject> {
    return {
      count: pagination.totalElements,
      items: pagination.content
    };
  }
}
