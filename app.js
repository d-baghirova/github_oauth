/* 
 * Package Imports
*/

//1
const session = require('express-session');

//3
const passport = require('passport');
const GitHubStrategy = require('passport-github2');

const path = require("path");
require("dotenv").config();
const express = require('express');
const partials = require('express-partials');

const app = express();


/*
 * Variable Declarations
*/

const PORT = 3000;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

/*
 * Passport Configurations
*/

//3

passport.use( new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  }, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  })
);

//4

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, user);
});

/*
 *  Express Project Setup
*/

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.json());
app.use(express.static(__dirname + '/public'));

//2
app.use(
  session({
    secret: 'codecademy',
    resave: false,
    saveUninitialized: false
  })
);

//3
app.use(passport.initialize());
app.use(passport.session());


/*
 * Routes
*/

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
})

app.get('/account', ensureAuthenticated, (req, res) => {
  res.render('account', { user: req.user });
});

app.get('/login', (req, res) => {
  res.render('login', { user: req.user });
})

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

//5
app.get('/auth/github', 
  passport.authenticate('github', {scope: ['user']})
);

app.get('/auth/github/callback', 
  passport.authenticate('github', {
    failureRedirect: '/login',
    successRedirect: '/'
  })
);

/*
 * Listener
*/

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

/*
 * ensureAuthenticated Callback Function
*/

function ensureAuthenticated  (req, res, next)  {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}