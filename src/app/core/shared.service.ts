import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private allocationsUpdated = new Subject<void>();
  private entryVerifiedSource = new Subject<void>();

  allocationsUpdated$ = this.allocationsUpdated.asObservable();
  entryVerified$ = this.entryVerifiedSource.asObservable();

  notifyAllocationsUpdated() {
    this.allocationsUpdated.next();
  }

  notifyEntryVerified() {
    this.entryVerifiedSource.next();
  }
}
