var fixtures                = require('../../fixtures'),
	donorsModel       = require('../../../models/donorsModel')(fixtures.mongo),
	donorsController  = require('../../../controllers/donorsController')(donorsModel),
	assert                  = require('assert'),
	debug                   = require('debug')('tempmon:test');

var request = fixtures.request;
var response = fixtures.response;
request.params._id = '5569c7fe17fa3690d24de049';

describe('donorsController', function () {
	it('#create', function(done) {
		request.body.any = '';
		response.json = function(obj) {
			assert.deepEqual(obj, {
        _id: '5569c7fe17fa3690d24de049',
				firstName: 'Test First Name',
				lastName: 'Test Last Name',
				contactNumber: '+55 555 5555 5555',
				emailAddress: 'email@text.com',
				bloodGroup: 'B+',
				lat: -19.556711598009,
				long: -55.192499649414856,
				ip: '127.0.0.1',
      });
			done();
		};
		donorsController.create(request, response, fixtures.next);
	});
	it('#getAll', function(done) {
		response.json = function(obj) {
			debug(obj);
			assert.deepEqual(obj, [{ "firstName" : "John"}, {"firstName" : "Peter"}]);
			done();
		};
		donorsController.getAll(request, response, fixtures.next);
	});
	it('#getById', function(done) {
		response.json = function(obj) {
			assert.deepEqual(obj, {contactNumber: "+55 333 5555 6666"});
			done();
		};
		donorsController.getById(request, response, fixtures.next);
	});
	it('#update', function(done) {
		response.json = function(obj) {
			assert.deepEqual(obj, {ok: 1, nModified: 1, n: 1 });
			done();
		};
		donorsController.update(request, response, fixtures.next);
	});
	it('#delete', function(done) {
		response.json = function(obj) {
			assert.deepEqual(obj, {ok: 1, n: 1});
			done();
		};
		donorsController.remove(request, response, fixtures.next);
	});


});//describe
