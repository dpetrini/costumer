/*
  Mock DB: simulates the methods of Mongo

  To check types compares with https://github.com/mafintosh/mongojs
*/

'use strict';
var debug   = require('debug')('tempmon:fixtures'),
	assert  = require('assert');

function _model() {}

var fixtures = {
	mongoose: {

    //Not in use here
		model: function(name, schema) {
			return _model;
		}

	},
	mongo: {
		collection: function(name) {
			return fixtures.mongo;
		},
		ObjectId: function() {
			return {};
		},
		find: function(query, callback) {
			callback(null, [{ "firstName" : "John"}, {"firstName" : "Peter"} ]);
		},
		findOne: function(query, callback) {
			callback(null, {"contactNumber": "+55 333 5555 6666"});
		},
		insert: function(data, callback) {
			callback(null, {
					"_id": "5569c7fe17fa3690d24de049",
					"firstName": 'Test First Name',
					"lastName": 'Test Last Name',
					"contactNumber": '+55 555 5555 5555',
					"emailAddress": 'email@text.com',
					"bloodGroup": 'B+',
					"lat": -19.556711598009,
					"long": -55.192499649414856,
					"ip": '127.0.0.1',
				});
		},
		update: function(query, data, callback) {
			callback(null, {"ok": 1, "nModified": 1, "n": 1 });
		},
		remove: function(query, callback) {
			callback(null, {"ok": 1, "n": 1 });
		}
	},
	next: function(err) {
		debug('catch err', err);
		assert.deepEqual(err, {});
	},
	request: {
		body: {},
		params: {},
		query: {}
	},
	response: {
		status: function(code) {
			return {
				json: function json(obj) {
					debug('not mocked', obj);
				}
			};
		},
		json: function(obj) {
			debug('not mocked', obj);
		}
	}
};
module.exports = fixtures;
