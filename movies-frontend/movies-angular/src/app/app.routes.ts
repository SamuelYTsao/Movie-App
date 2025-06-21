import { Routes } from '@angular/router';
import { LoginBoxComponent } from './login-box/login-box.component';
import { MainPageComponent } from './main-page/main-page.component';

export const routes: Routes = [
  { path: '', component: LoginBoxComponent},
  { path: 'main-page', component: MainPageComponent},
  { path: 'login', component: LoginBoxComponent}
  
];
