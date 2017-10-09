let request = require('supertest'),
	assert = require('assert'),
	debug = require('debug')('tempmon:test'),
	app = require('../../app'),
	mongo = require('../../db/mongo');

const insert = function (callback) {
	const dummy = {
		firstName: 'Test First Name',
		lastName: 'Test Last Name',
		contactNumber: '+55 555 5555 5555',
		emailAddress: 'email@text.com',
		bloodGroup: 'B+',
		lat: -19.556711598009,
		long: -55.192499649414856,
		ip: '127.0.0.1',
	};
	mongo.collection('donors').insert(dummy, callback);
};

describe('Donors Easy Express App Endpoints', () => {

	before(function (done) {
    // Needed for cloud db connection
		this.timeout(10000);
		const donors = [
			{
				// required fields
				firstName: 'Test First Name',
				lastName: 'Test Last Name',
				contactNumber: '+55 555 5555 5555',
				emailAddress: 'email@text.com',
				bloodGroup: 'B+',
				lat: -19.556711598009,
				long: -55.192499649414856,
				ip: '127.0.0.1',
			},
			{
				// Not Required fields
				firstName: 'Test First Name',
				contactNumber: '+55 555 5555 5555',
				emailAddress: 'email@text.com',
				bloodGroup: 'B+',
				lat: -19.556711598009,
				long: -55.192499649414856,
				ip: '127.0.0.1',
			},
			{
				// Not Required fields
				firstName: ' ',
				contactNumber: '+55 555 5555 5555',
				emailAddress: 'email@text.com',
				bloodGroup: 'B+',
				lat: -19.556711598009,
				long: -55.192499649414856,
				ip: '127.0.0.1',
			},
		];
		mongo.collection('donors').insert(donors, (err, data) => {
			if (err) {
				throw err;
			}
			debug('Describe..' + JSON.stringify(data));
			done();
		});
	});

	afterEach(done => {
		mongo.collection('donors').remove({}, done);
	});

	it('GET /donors | returns all devices', function (done) {
		this.timeout(5000);
		request(app)
      .get('/donors')
      .end((err, response) => {
	const body = response.body;
	assert.equal(body.length, 3);
	assert.equal(body[0].lat, -19.556711598009);
	assert.equal(body[2].emailAddress, 'email@text.com');
	done();
});
	});

	it('GET /donors/:_id', function (done) {
		this.timeout(5000);
		insert((err, result) => {
			const _id = result._id;
			request(app)
        .get(`/donors/${ _id }`)
        .end((err, response) => {
	const body = response.body;
	delete body._id;
	assert.deepEqual(body, {
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
	});
	it('GET /donors/:_id not found', function (done) {
		this.timeout(5000);
		const _id = '55555aaaaa55555aaaaa4444';
		request(app)
      .get(`/donors/${ _id }`)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, response) => {
	const body = response.body;
	assert.equal(response.statusCode, 404);
	done();
});
	});

	it('POST /donors', function (done) {
		this.timeout(5000);
		const esp = {
			firstName: ' ',
			contactNumber: '+55 555 5555 5555',
			emailAddress: 'email@text.com',
			bloodGroup: 'B+',
			lat: -19.556711598009,
			long: -55.192499649414856,
			ip: '127.0.0.1',
		};
		request(app)
      .post('/donors')
      .send(esp)
      .expect(201)
      .end((err, response) => {
	const body = response.body;
	assert.equal(body.bloodGroup, 'B+');
	assert.ok(body._id);
	done();
});
	});

	it('GET - Special entry for simplequery tests /donors/donors ', function(done) {
	this.timeout(5000);
	var esp = { 
	firstName: ' ',
	contactNumber: '+55 555 5555 5555',
	emailAddress: 'email@text.com',
	bloodGroup: 'B+',
	lat: -19.556711598009,
	long: -55.192499649414856,
	ip: '127.0.0.1',
};
	request(app)
      .get('/donors/donors')
      .query(esp)
      .expect(200)
      .end(function(err, response) {
	var body = response.body;
	assert.equal(body.bloodGroup, 'B+');
	assert.equal(body.long, -55.192499649414856);
	done();
});
});

	it('PUT /donors/:_id', function (done) {
		this.timeout(5000);
		insert((err, result) => {
			const _id = result._id;
			request(app)
        .put(`/donors/${ _id }`)
        .send({ firstName: 'TESTER GOOD NAME' })
        .end((err, response) => {
	const body = response.body;
          // Não podemos comparar o obj abaixo pois com acesso nuvem a resposta é diferente
          // assert.deepEqual(body, { ok: true, n: 1, updatedExisting: true });
	assert.equal(body.ok, 1);
	assert.equal(body.n, 1);
	assert.equal(body.nModified, 1);
	done();
});
		});
	});
  
	it('DELETE /donors/:_id', function (done) {
		this.timeout(5000);
		insert((err, result) => {
			const _id = result._id;
			request(app)
        .delete(`/donors/${ _id }`)
        .end((err, response) => {
	const body = response.body;
          // Não podemos comparar o obj abaixo pois com acesso nuvem a resposta é diferente
          // assert.deepEqual(body, { n: 1 });
	assert.equal(body.ok, 1);
	assert.equal(body.n, 1);
	done();
});
		});
	});

});// describe
