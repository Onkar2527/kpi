import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { PeriodService } from 'src/app/core/period.service';

// Login component.  Presents a simple form for username and
// password.  On submission it invokes the AuthService to perform
// authentication.  Uses standalone API so it can be lazily
// loaded via the router.
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  showPassword = false;
  period: any;

  constructor(private auth: AuthService, private periodService: PeriodService) {}

  onSubmit() {
    if (!this.username || !this.password) {
      return;
    }
    this.auth.login(this.username, this.password,this.period);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe((period) => {
      this.period = period;
    });
  }
  
}
