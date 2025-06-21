import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginBoxComponent } from './login-box/login-box.component';
import { MainPageComponent } from './main-page/main-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginBoxComponent, MainPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'grocery-angular';
}
