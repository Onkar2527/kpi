import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  filterData(data: any[], searchTerm: string): any[] {
    if (!searchTerm) {
      return data;
    }
    return data.filter(item => {
      return Object.keys(item).some(key => {
        return String(item[key]).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }
}
