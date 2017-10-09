/** Donors Controller
 *   Responds to Express Rourter for /donors
 *   Receives data  and send to models (database). Donors app
 *   Supports optimization in queries if needed: use Sort or Projection
 *    from Mongo DB
 *
 * @module donorsController
 */

const debug = require('debug')('donors:controller');

// Objeto escopo desta funcao foi passado pelo router e eh atribuido em this abaixo
function donorsController (donorsModel) {
	this.model = donorsModel;
}

// List all elements on database - JSON, for front-end
donorsController.prototype.getAll = function (request, response, next) {
	this.model.find({}, (err, data) => {
		if (err) {
			return next(err);
		}
		response.json(data);
	});
};

// List all elements on database - Friendly
donorsController.prototype.getAllFriendly = function (request, response, next) {
	this.model.findSorted({}, (err, data) => {   // brings sorted by firstName
	// this.model.find({}, (err, data) => {  // vanilla find
	// this.model.find2({}, { firstName: 1, lastName: 1, _id: 0 }, (err, data) => { // set projection here
		if (err) {
			return next(err);
		} else
			if (data.length) {
				response.render('donors', { donors: data });
			} else {
				response.send('No documents found');
			}
	});
};

// Begin Edition

// Get ID e coloca na tela para edicao no form
donorsController.prototype.getUpdateById = function (request, response, next) {
	const _id = request.params._id;
	this.model.findOne(_id, (err, data) => {
		if (err) {
			return next(err);
		} else
			if (data !== null) {
				response.render('donor_form', {
					title: 'Update Donor Info:',
					donors: data,
				});
			} else {
				response.send('No documents found');
			}
	});
};

// Receives form with POST and performs UPDATE (or DELETE) in database
donorsController.prototype.postUpdateById = function (request, response, next) {

	const _id = request.params._id;
	const body = request.body;
	debug(_id);

	// if marked to delete do it now
	if (body.delete === 'delete-yes') {

		debug('Delete id: ' + _id);
		this.model.remove(_id, (err, data) => {
			if (err) {
				return next(err);
			}
			debug(` update response:${ JSON.stringify(data) }`);
			response.send('Your register was deleted.');
			// TODO colocar pug view para mensagens
			return;
		});
	}

	debug('Not delete...');

	// Check that the name field is not empty
	request.checkBody('firstName', 'First Name Required').notEmpty(); 

	// To add more specific validation = custom:
	// https://www.npmjs.com/package/express-validator#customvalidators

	// Trim and escape the name field.
	request.sanitize('firstName').escape();
	request.sanitize('firstName').trim();

	// Run the validators
	const errors = request.validationErrors();

	if (errors) {
		// If there are errors render the form again, passing the
		//  previously entered values and errors
		response.render('donor_form', {
			title: 'Update Donor Info:',
			donors: body,
			errors,
		});
		return;
	}

	// Data from form is validated

	// Retrieve id´s data from DB
	this.model.findOne(_id, (err, data) => {
		debug(data);
		if (err) {
			return next(err);
		}

		debug('Body:'); debug(body);

		// If not check box selected, update data
		if (body.delete === undefined) {

			const deviceData	= {
				_id: data._id,
				firstName: body.firstName,
				lastName: body.lastName,
				contactNumber: body.contactNumber,
				emailAddress: body.emailAddress,
				bloodGroup: body.bloodGroup,
				lat: data.lat,
				long: data.long,
				ip: data.ip,
			};

			debug(deviceData);

			// perform the update
			this.model.update(deviceData._id, deviceData, (err, data) => {
				if (err) {
					return next(err);
				}
				debug(` update response:${ JSON.stringify(data) }`);
				response.send('Your data was successfully updated.');
				// TODO colocar pug view para mensagens
			});
		}
	});
};

// End Edition

donorsController.prototype.getById = function (request, response, next) {
	const _id = request.params._id;
	this.model.findOne(_id, (err, data) => {
		if (err) {
			return next(err);
		}
		if (!data) {
			err = new Error('Not Found');
			err.status = 404;
			return next(err);
		}
		response.json(data);
	});
};
donorsController.prototype.create = function (request, response, next) {
	const body = request.body;
	debug(body);
	this.model.create(body, (err, data) => {
		if (err) {
			return next(err);
		}
		response.json(data);
	});
};
/*
Creates based in GET with parameters
Validates user (machine) input

Get URL example: /sensor?node_id=100&temp=27&humd=80&state="Op/Ok"
http://127.0.0.1:3000/donors/donors/?firstName=Daniel&lastName=Petrini&contactNumber=11996586833&
  emailAddress=ddd@gmail.com&bloodGroup=B+&lat=23.45&long=56.00&ip=127.0.0.1
*/
donorsController.prototype.createNew = function (req, response, next) {
	const timeNow = new Date();
	const time = timeNow.getTime();

	debug(`${ req.query.firstName } | ${ req.query.lastName } | ${req.query.emailAddress } | ${ time }`);

	const deviceData
	= {
		firstName: req.query.firstName,
		lastName: req.query.lastName,
		contactNumber: req.query.contactNumber,
		emailAddress: req.query.emailAddress,
		bloodGroup: req.query.bloodGroup,
		lat: req.query.lat,
		long: req.query.long,
		ip: req.query.ip,
		time,

	};

	debug(req); // Not all request data in device data...
	debug(deviceData);

	this.model.create(req, (err, data) => {
		if (err) {
			return next(err);
		}
		response.json(data);
	});
};

donorsController.prototype.update = function (request, response, next) {
	const _id = request.params._id;
	const body = request.body;
	this.model.update(_id, body, (err, data) => {
		if (err) {
			return next(err);
		}
		debug(` update response:${ JSON.stringify(data) }`);
		response.json(data);
	});
};
donorsController.prototype.remove = function (request, response, next) {
	const _id = request.params._id;
	this.model.remove(_id, (err, data) => {
		if (err) {
			return next(err);
		}
		response.json(data);
	});
};

module.exports = function (donorsModel) {
	return new donorsController(donorsModel);
};
