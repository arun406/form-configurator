import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserComponent } from '../user/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, UserComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {

}
