/**
 * @fileOverview Main Express App for Solar Vendor System.
 * @Author Daniel Petrini - ISI  - 08/10/2017
 * @version 0.1.0
 */

const debug = require('debug')('app.js'); // eslint-disable-line no-unused-vars
const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const dbUrl = require('./db/dbUrl');

const app = express();
const path = require('path'); // eslint-disable-line import/no-nodejs-modules

const url = dbUrl();

// use sessions to track logins
app.use(session({
	secret: 'sun vendor costumer',
	resave: true, // forces the session to be sabe in session store
	saveUninitialized: false, // don´t save un intialized session
	store: new MongoStore({ url }), // saves sessions to mongo, instead of RAM
}));

// make user ID available in templates
// this is a custon middleware
app.use((req, res, next) => {
	res.locals.currentUser = req.session.userId; // locals -> variable in express
	next();
});

// A server can create, modify, delete and read cookies.

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// server config
app.use(methodOverride('X­HTTP­Method'));
app.use(methodOverride('X­HTTP­Method­Override'));
app.use(methodOverride('X­Method­Override'));
app.use(methodOverride('_method'));

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator()); // To perform form validation

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

// router
app.use('/', require('./routes'));

// error handling
app.use((request, response, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {},
	});
});

// server listener
module.exports = app;