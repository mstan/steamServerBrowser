/* Modules */
var express = require('express');
var ejs = require('ejs');
var sqlite3 = require('sqlite3');
var bodyParser = require('body-parser');
//var steamServerStatus = require('steam-server-status');
//var async = require('async');

/* lib */

var loadAll = require('./lib/loadAll.js');
var searchFilter = require('./lib/searchFilter');
var addNewServer = require('./lib/addNewServer');
var getTokenByID = require('./lib/getTokenByID');
var updateEntryByID = require('./lib/updateEntryByID');
var deleteEntryByID = require('./lib/deleteEntryByID');


/* Start Express */
var app = express();


//start db
var dbFile = './db/db.sqlite';
var db = new sqlite3.Database(dbFile);

/* middleware */
app.use(bodyParser.urlencoded({ extended: false }))

  //For deps to hook reqs
app.use(function (req,res,next) {
  res.locals.msg = req.query.msg || null;
  req.db = db;
  next();
});

app.param('id', getTokenByID);

app.set(express.static(__dirname + 'views'));
app.use(express.static(__dirname + '/bower_components/bootstrap/dist/css'));
app.set('view engine', 'ejs');



/* Routing */

app.get('/', loadAll);

app.post('/', searchFilter);

app.get('/new', function (req,res) {
	res.render('pages/addNewServer');
})

app.post('/new', addNewServer);

app.get('/viewEntry/:id', function (req,res) {
    server = req.server;
    res.render('pages/viewEntry', {server: server});
});

app.post('/viewEntry/', updateEntryByID);

app.post('/deleteEntry/', deleteEntryByID);


/* Start app at this port */

app.listen(3000);