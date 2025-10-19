import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor() { }

  getPaginatedData(data: any[], page: number, pageSize: number): any[] {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }

  getTotalPages(data: any[], pageSize: number): number {
    return Math.ceil(data.length / pageSize);
  }
}
