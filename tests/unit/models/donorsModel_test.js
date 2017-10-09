var fixtures          = require('../../fixtures'),
	donors = require('../../../models/donorsModel')(fixtures.mongo),
	assert            = require('assert'),
	debug             = require('debug')('tempmon:test');

describe('donors', function () {
	it('#insert', function(done) {
		donors.create({any: "333"}, function(err, result) {
			assert.deepEqual(result, {
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
		});
	});
	it('#find', function(done) {
		donors.find({}, function(err, result) {
			assert.equal(result.length, 2);
			done();
		});
	});
	it('#findOne', function(done) {
		donors.findOne({contactNumber: "+55 333 5555 6666"}, function(err, result) {
			assert.equal(result.contactNumber, "+55 333 5555 6666");
			done();
		});
	});
	it('#update', function(done) {
		donors.update({ firstName : "Jonh" }, { temperature: '44' }, function(err, result) {
			debug(result);
			assert.deepEqual(result, {"ok": 1, "nModified": 1, "n": 1});
			done();
		});
	});
	it('#remove', function(done) {
		donors.remove({firstName : "Peter"}, function(err, result) {
			assert.deepEqual(result, {"ok": 1, "n": 1});
			done();
		});
	});
});//describe
