// const express = require('express');
// const app = express();
// const port = process.env.PORT || 3000;
// const bodyParser = require('body-parser');
// const cors = require('cors');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const pool = require('./database.js');
//do i need to require the moviesAPI thing from here? i guess so???
require("dotenv").config();


const initializePassport = require("./passportConfig");

initializePassport(passport);


// app.use(cors({
//   origin: 'http://localhost:4200',
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true}));
// app.use(bodyParser.json());
// app.use(flash());

router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true
    }
  })
);

router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

//AUTHENTICATION NOT WORKING FIX IT

//add back in later
// app.post("/login", passport.authenticate("local"), (req, res) => {
//   console.log("Getting inside the post accept?");
//   res.status(200).json({message: "Successful authentication."});
// });


router.post("/logout", (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    //success
    console.log('logout success');
    res.status(200).json({ message: "Logged out successfully." });
    //then in frontend redirect page
  });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      console.log("Authentication failed:", info);
      return res.status(400).json({ message: info.message });
    }

    req.logIn(user, err => {
      if (err) return next(err);
      console.log("Successful login for user:", user.username);
      const sessionID = req.session.passport.user;


      return res.status(200).json({ message: "Successful authentication." });
    });
  })(req, res, next);
});

router.post("/register", async (req, res) => {

  const {username, email, password} = req.body;

  let errors = [];

  // if (!username || !email || !password) {
  //   errors.push({message: "Please enter all fields."});
  // }
  console.log('Received user info:', username, email, password);
  //then have to add to database somewhere?

  //ERROR CHECK LATER
  // let errors = [];

  let hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword); //yay it works

  //SEARCH IN DATABASE TO SEE IF ALREADY EXISTS
  pool.query(
    'SELECT * from userInfo WHERE email = ?', [email],
    (err, results) => {
      if (err) {
        throw err;
      }
      
      console.log(results); //what does this do?
      if (results.length > 0) {
        console.log('getting here?');
        errors.push({message: "Email already in use."});
        return res.status(400).json({ message: "Email already in use" });
        //render in HTML this error?
      } else {
        //insert into table
        
        pool.query('INSERT INTO userInfo (username, email, password) VALUES (?, ?, ?)', 
          [username, email, hashedPassword],
          (err, results) => {
            if (err) {
              throw err;
            }
            console.log(results.rows);
            //somehow redirect to the user page except im using angular not .ejs so idk how to do that
            //some js code that brings back the login page?
          })
      }
    }
  );



});

module.exports = router;

// function checkAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     //redirect on angular side
//   }
//   next();
// }

// function checkNotAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   //redirect on angular side
// }
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// })

