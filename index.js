/* Modules */
var express = require('express');
var ejs = require('ejs');
var sqlite3 = require('sqlite3');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');

/* lib */
//Middleware
var middlewareTokens = require('./lib/middlewareTokens.js');
var userLoggedInCheck = require('./lib/userLoggedInCheck.js');
var getTokenByID = require('./lib/getTokenByID');
//Public Table Query
var loadAll = require('./lib/loadAll.js');
var searchFilter = require('./lib/searchFilter');
//Admin
var addNewServer = require('./lib/addNewServer');
var entryByIDHandler = require('./lib/entryByIDHandler.js');
//User
var connectToServerDirect = require('./lib/connectToServerDirect.js');
var viewServer = require('./lib/viewServer.js');
var viewAllServersByOwner = require('./lib/viewAllServersByOwner');
var addNewUserIfNotExists = require('./lib/addNewUserIfNotExists');



/* Start Express */
var app = express();

/* Start Database */
var dbFile = './db/db.sqlite';
var db = new sqlite3.Database(dbFile);
app.use(function (req,res,next) {
  req.db = db;
  next();
});

//Passport
var steamStrategyConfiguration = require('./lib/steamStrategy.js');
passport.use(steamStrategyConfiguration);

app.param('id', getTokenByID);

app.set('view engine', 'ejs');

app.set(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/bower_components/bootstrap/dist/css'));
app.use(express.static(__dirname + '/bower_components/jquery/dist/'));

app.use(session({secret: 'secret token', resave: true, saveUninitialized: true}));
app.use(cookieParser('super secret token'));
app.use(passport.initialize());
app.use(passport.session()); //Q: User not defined when session handler is trying to be used
app.use(bodyParser.urlencoded({ extended: false }));

/* Global Parameterization */

/* ============================ 

    The following exist to
    globalize some of our vars

    res.locals.user/req.user -
    Exists for when information
    is needed about our user.

   ============================ */

  //For Req/Res to hook Deps
app.use(middlewareTokens);




/* Middleware for Steam Auth/Passport */

/* ============================ 

    The following all exists for
    Passport. Since we use Steam,
    we have a steam redirect,
    a steam return, and 
    seralization functions
    for our end user

   ============================ */

app.get('/auth/steam',
  passport.authenticate('steam'),
  function (req, res) {
    // The request will be redirected to Steam for authentication, so
    // this function will not be called.
  });

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/'}),
  addNewUserIfNotExists);

passport.serializeUser(function (user, done) {
  done(null, user);
}); 
 
passport.deserializeUser(function (user, done) {
  done(null, user);
});


/* Routing */

/* ============================ 

    userLoggedInCheck should be 
    run for any route that would
    require a logged user to 
    initiate.

   ============================ */

  //Index
app.get('/', loadAll);
app.post('/', searchFilter);

  //New Server
app.get('/new', userLoggedInCheck, addNewServer.GET);
app.post('/new', userLoggedInCheck, addNewServer.POST);

  //Admin View Entry
app.get('/viewEntry/:id', entryByIDHandler.viewEntry);
app.post('/viewEntry/', entryByIDHandler.updateEntry);
app.post('/deleteEntry/', entryByIDHandler.deleteEntry);
app.get('/viewMyServers/', userLoggedInCheck, viewAllServersByOwner);

  //User View Entry
app.get ('/publicServer/:id', viewServer);
app.post ('/connectToServer/', connectToServerDirect);


/* Start app at this port */

app.listen(3000);