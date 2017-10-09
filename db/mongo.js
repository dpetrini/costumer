/**
 * @fileOverview Mongo db connection object creation.
 */

'use strict';

const mongojs = require('mongojs');
const config = require('config');
const debug = require('debug')(config.get('appName') + ':db');

const dbUrl = require('./dbUrl'); // makes the connection url with ENVs

const db = mongojs(dbUrl());

db.on('error', err => {
	debug(err);
});

db.on('connect', () => {
	debug('Mongo database connected');
});

module.exports = db;