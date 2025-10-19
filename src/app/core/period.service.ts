import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  private periodSource = new BehaviorSubject<string>('');
  currentPeriod = this.periodSource.asObservable();

  constructor(private http: HttpClient) {
    this.getPeriod().subscribe();
  }

  getPeriod() {
    return this.http.get<{ period: string }>(`${environment.apiBaseUrl}/periods`).pipe(
      tap(response => {
        this.periodSource.next(response.period);
      })
    );
  }

  changePeriod(period: string) {
    return this.http.post(`${environment.apiBaseUrl}/periods`, { period }).pipe(
      tap(() => {
        this.periodSource.next(period);
      })
    );
  }
}
