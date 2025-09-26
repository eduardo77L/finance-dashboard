import { Component } from '@angular/core';
import { Dashboard } from './components/dashboard/dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Dashboard],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  title = 'dashboard';
}
