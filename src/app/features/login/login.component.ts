import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';

// Login component.  Presents a simple form for username and
// password.  On submission it invokes the AuthService to perform
// authentication.  Uses standalone API so it can be lazily
// loaded via the router.
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;

  constructor(private auth: AuthService) {}

  onSubmit() {
    if (!this.username || !this.password) {
      return;
    }
    this.auth.login(this.username, this.password);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
