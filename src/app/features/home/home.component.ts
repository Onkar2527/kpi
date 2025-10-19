import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';

// Home component displayed after successful login.  It shows a
// simple welcome message including the user's name, role and
// branch (if applicable) and provides a logout button.
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(public auth: AuthService) {}

  /** Log out the current user. */
  logout() {
    this.auth.logout();
  }
}