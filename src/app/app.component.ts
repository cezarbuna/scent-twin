import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ScentTwin';
  showBottomNav = true;
  
  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Hide bottom nav on certain routes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const hideNavRoutes = ['/welcome', '/selfie', '/quiz'];
        this.showBottomNav = !hideNavRoutes.some(route => event.url.includes(route));
      });
  }
}
