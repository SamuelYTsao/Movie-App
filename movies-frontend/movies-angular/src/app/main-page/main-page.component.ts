import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-main-page',
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  searchValue: string = ""; //used for ngModel
  movieArray: any[] = []; //used for ngFor

  constructor (private router: Router, private http: HttpClient) {

  }

  logoutFunction() {
    console.log('about to logout');
    this.http.post("http://localhost:3000/logout", {withCredentials: true}).subscribe(
      (res) =>  {
        console.log('successful logout');
        this.router.navigate(['/login']); //should just redirect back to main page
      },
      (err) => console.log(err)
    );
    
  }

  handleFavorites(event: any) {
    console.log('about to add to favorites');

    //basically do same things as below
    const parentOfClicked = event.target.parentNode; //gets an entire movieCard

    //need to send session ID to so you can identify
    const movieInfo = {
      image: parentOfClicked.children[0].src,
      title: parentOfClicked.children[1].textContent,
      overview: parentOfClicked.children[2].textContent,
      movieID: parentOfClicked.children[3].textContent
    }

    //check if work
    console.log(movieInfo.image);
    console.log(parentOfClicked.children[1].textContent);
    console.log(parentOfClicked.children[2].textContent);
    //now i want to put the img, title, and overview into a single object and send to backend to add to watchlist

    this.http.post("http://localhost:3000/main-page/favoritelist", movieInfo, { withCredentials: true }).subscribe(); 
  }

  handleWatchlist(event: any) {
    console.log('about to handle watchlist');
    //make a post to backend?
    //how do I access the 
    //get the title of the movie
    const parentOfClicked = event.target.parentNode; //gets an entire movieCard

    //need to send session ID to so you can identify
    const movieInfo = {
      image: parentOfClicked.children[0].src,
      title: parentOfClicked.children[1].textContent,
      overview: parentOfClicked.children[2].textContent,
      movieID: parentOfClicked.children[3].textContent
    }

    //check if work
    console.log(movieInfo.image);
    console.log(parentOfClicked.children[1].textContent);
    console.log(parentOfClicked.children[2].textContent);
    //now i want to put the img, title, and overview into a single object and send to backend to add to watchlist

    this.http.post("http://localhost:3000/main-page/watchlist", movieInfo, { withCredentials: true }).subscribe(); 
    //do i even need to subscribe
    //need to make a query to retrieve the data
    //?navigate to a watchlist component?

    //need to pass in session ID or something to backend
    //backend make a query with users id to find their watchlist
    //create a database for watchlist on registration?

    // this.http.post("http://localhost:3000/main-page/watchlist");

  }

  async triggerSearch() {
    console.log(this.searchValue);
    //reassign movieArray does this do it properly?
    this.movieArray = [];
    // let movieArray: any[] = [];
    const response = await firstValueFrom(
      this.http.post<any>("http://localhost:3000/main-page/search", {searchValue: this.searchValue})
    );

        
    response.results.forEach( (element: any) => {
      this.movieArray.push({ 
        movie: {
          title: element.title,
          overview: element.overview,
          image: 'https://image.tmdb.org/t/p/w500' + element.poster_path,
          id: element.id
        }
      });

    });
        
    //checking array contents delete later
    console.log('about to print array contents');
    this.movieArray.forEach((element: any )=> {
          console.log(element.movie.title);
    });


    

    //maybe put this in a helper method later on
    //making title and input move up... they need to start center first tho
    var topSection = document.getElementById("titleAndSearch");
    if (topSection) {
      requestAnimationFrame(() => {
        topSection?.classList.add("container-transition");
      });
    }
    

    //making box move up
    //also maybe make this helper method later
    var whiteBox = document.getElementById("white-display-box");
    
    if (whiteBox && getComputedStyle(whiteBox).display == "none") {
      whiteBox.classList.remove('fadeInUp-animation');

      whiteBox.style.display = "grid";

      requestAnimationFrame(() => {
        whiteBox?.classList.add("fadeInUp-animation");
      });
    }

    
  }


 

}
