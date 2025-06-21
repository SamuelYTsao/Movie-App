import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login-box',
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.css']
})
export class LoginBoxComponent {
  
  username: string = "";
  email: string = "";
  password: string = "";

  constructor(private router: Router, private http: HttpClient) {
    

  }

  handleSignin() {
    //change this later to actually verify login info
    const userInfo : any = {
      username: this.username,
      password: this.password
    };

    console.log("username: ", this.username);
    console.log("password: ", this.password);

    this.http.post('http://localhost:3000/login', userInfo, {withCredentials: true}).subscribe(
      response => {

        console.log('valid login success?');
        window.location.href = '/main-page';
        this.router.navigate(['main-page']);
      },
      error => {
        console.log("signin failed");
        console.log(error);
      }
    )

    

    // this.router.navigate(['main-page']); //REMOVE LATER

  }

  handleSignUp() {
    var loginForm = document.getElementById('loginForm');
    var signupForm = document.getElementById('signupForm');

    //fade out login form
    requestAnimationFrame(() => {
      loginForm?.classList.add('fade-out');
    });
    
    loginForm?.addEventListener("animationend", () =>  {
        loginForm!.style.display = "none";

        signupForm!.style.display = "flex";
      }, {once: true}
    );

  //   //fade in the signup form
    
    requestAnimationFrame(() => {
      signupForm?.classList.add('fade-in');
    });
  }

  handleRegistration() {
    //change this later to actually verify login info
    //handle field validation here? aka if they actually typed something

    const userInfo : any = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:3000/register', userInfo).subscribe(
      response => {
        console.log('backend success?');



      },
      error => {
        console.log("http post in registration failed");
        console.log(error);
      }
    )

    //redirect to login page actually
    //this.router.navigate(['main-page']);

    
  }

}
