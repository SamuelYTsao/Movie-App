//main server
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();
const session = require('express-session');
const passport = require('passport');
require('./passportConfig')(passport);


const movies = require('./moviesAPI.js');
const loginAndSignup = require('./login-and-signup.js');

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(bodyParser.json());



app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use('/', loginAndSignup); //handles logging in
app.use('/main-page', movies); //handles searching logic


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})