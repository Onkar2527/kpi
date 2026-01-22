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

filterByBranchSearch(data: any[], searchTerm: string): any[] {
  if (!searchTerm) {
    return data;
  }

  const searchStr = String(searchTerm).trim();

 
  if (searchStr.length >=10) {
    return data.filter(item => String(item.account_no) === searchStr);
  } 
  
  if (searchStr.length <= 5) {
    return data.filter(item => String(item.PF_NO) === searchStr);
  } 
  

  return data.filter(item => 
    String(item.branchName).toLowerCase().includes(searchStr.toLowerCase())
  );
}


}
