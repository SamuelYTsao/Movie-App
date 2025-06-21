//this will hold my api calls

const express = require('express');
const router = express.Router();
const axios = require('axios');
const { pool } = require('./database.js');
const passport = require('passport');
require('dotenv').config();

const tmdbInfo = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    accept: 'application/json'
  }
});




//no idea if this will work
router.post("/search", passport.authenticate('session'), async (req, res) => {
  const { searchValue } = req.body;
  console.log(searchValue); //is req the search term?
  const response = await tmdbInfo.get('/search/movie', {
    params: {
      query: searchValue
    }
  });
  
  console.log(response.data);
  res.json(response.data);
  

});

//for adding to a watchlist
router.post("/watchlist", userAuthentication, async (req, res) => {

  console.log('about to add to watchlist');
  //need to get session ID somewhere
  const sessionID = req.user.id; //does this work?
  const {image, title, overview, movieID} = req.body;
  console.log(title);
  console.log(sessionID);
  //add to sql table
  pool.query(
    'SELECT * FROM watchlist where movieID = ? AND userId = ?', [movieID, sessionID],
    (err, results) => {
      if (err) {
        throw err;
      }
      //keep going
      if (results.length > 0) {
        //this specific user has added this specific movie
        return res.status(400).json({ message: "Already in watchlist" });
      } else {
        //doesn't exist, add to watchlist
        pool.query(
          //need a column for session ID
          'INSERT into watchlist (movieImg, movieTitle, movieSummary, userID, movieID) VALUES (?, ?, ?, ?, ?)',
          [image, title, overview, sessionID, movieID],
          (err, results) => {
            if (err) {
              throw err;
            }
            console.log(results.rows);
            console.log('added to watchlist successfully');
          }
        );
      }

    }
  );
});

//for adding to favorites
//basically same as above
router.post("/favoritelist", userAuthentication, async (req, res) => {

  console.log('about to add to favoritelist');
  //need to get session ID somewhere
  const sessionID = req.user.id; //does this work?
  const {image, title, overview, movieID} = req.body;
  console.log(title);
  console.log(sessionID);
  //add to sql table
  pool.query(
    'SELECT * FROM favoriteList where favoriteMovieID = ? AND favoriteUserId = ?', [movieID, sessionID],
    (err, results) => {
      if (err) {
        throw err;
      }
      //keep going
      if (results.length > 0) {
        //this specific user has added this specific movie
        return res.status(400).json({ message: "Already in favoritelist" });
      } else {
        //doesn't exist, add to watchlist
        pool.query(
          //need a column for session ID
          'INSERT into favoriteList (favoriteImg, favoriteTitle, favoriteSummary, favoriteUserID, favoriteMovieID) VALUES (?, ?, ?, ?, ?)',
          [image, title, overview, sessionID, movieID],
          (err, results) => {
            if (err) {
              throw err;
            }
            console.log(results.rows);
            console.log('added to favoritelist successfully');
          }
        );
      }

    }
  );
});

function userAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Not Authenticated' })
}

module.exports = router;