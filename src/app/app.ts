import { Component } from '@angular/core';
import { MainNavComponent } from './main-nav/main-nav.component';
import { HeaderComponent } from './header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainNavComponent, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'form-configurator-app';
}
