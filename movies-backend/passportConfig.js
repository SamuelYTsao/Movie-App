const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { pool } = require('./database.js');

function initialize(passport) {
  console.log("initialized?"); //ok so its getting in this file at least
  const authenticateUser = (username, password, done) => {
    pool.query(
      'SELECT * FROM userInfo WHERE username = ?',
      [username],
      (err, results) => {
        if (err) {
          throw err;
        }
        if (results.length > 0) {
          const user = results[0];
          bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
              console.log(err);
            }
            if (match) {
              return done(null, user);

            } else {
              //r we getting here?
              return done(null, false, { message: "Incorrect password."});
            }
          });
        } else {
          return done(null, false, { message: "Username does not exist."});
        }
      }
    );
  };


  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password"
      },
      authenticateUser
    )
  );


  passport.serializeUser((user, done) => done(null, user.id));


  passport.deserializeUser((id, done) => {
    pool.query(`SELECT * FROM userInfo WHERE id = ?`, [id], (err, results) => {
      if (err) {
        return done(err);
      }
      console.log(`ID is ${results[0].id}`);
      return done(null, results[0]);
    });
  });
}

module.exports = initialize;