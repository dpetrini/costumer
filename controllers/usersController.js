/** users Controller
 *   Responds to Express Rourter for /users
 *   Receives data  and send to models (database). users app
 *   Supports optimization in queries if needed: use Sort or Projection
 *    from Mongo DB
 *
 * @module usersController
 */

const config = require('config');
const debug = require('debug')(config.get('appName') + ':controller');
const bcrypt = require('bcrypt'); // hash and salt (random concatenate) password

// Objeto escopo desta funcao foi passado pelo router e eh atribuido em this abaixo
function usersController (usersModel) {
	this.model = usersModel;
}

// Receives form with POST and performs UPDATE (or DELETE) in database
usersController.prototype.createNew = function (request, response, next) {

	if (request.body.email
		&& request.body.name
		&& request.body.favoriteBook
		&& request.body.password
		&& request.body.confirmPassword) {

        // confirm that user typed same password twice
		if (request.body.password !== request.body.confirmPassword) {
			const err = new Error('Passwords do not match.');
			err.status = 400;
			return next(err);
		}

      // create object with form input
		const userData = {
			email: request.body.email,
			name: request.body.name,
			favoriteBook: request.body.favoriteBook,
			password: request.body.password,
		};

		// hash and salt (random concatenate) password
		bcrypt.hash(userData.password, 10, (err, hash) => {
			if (err) {
				return (err);
			}
			userData.password = hash;

			// Save on DB
			this.model.create(userData, (err, user) => {
				debug('Authenticate user:', user, err);
				if (err) {
					if (err.code === 11000) {
            err.message = 'Email já existente na base de dados.';
          }
					return next(err);
				}
				request.session.userId = user._id;
				return response.redirect('/users/profile');
			});
		});

	} else {
		const err = new Error('All fields required.');
		err.status = 400;
		return next(err);
	}

};

// Authenticate, compare current password with bcripted in server, start session
// and goes to /profile
usersController.prototype.authenticate = function (request, response, next) {

	if (request.body.email
		&& request.body.password) {

		this.model.find({ email: request.body.email }, (err, user) => {

			debug('Authenticate user:', user);

			if (err) {
				return next(err);
			} else if (!user[0]) {
				const err = new Error('User not found.');
				err.status = 401;
				return next(err);
			}

			bcrypt.compare(request.body.password, user[0].password, (error, result) => {
				if (result === true) {
					request.session.userId = user[0]._id;
					return response.redirect('/users/profile');
				}
				const err = new Error('Wrong email or password.');
				err.status = 401;
				return next(err);
			});
		});
	}
};


usersController.prototype.showProfile = function (request, response, next) {

	if (!request.session.userId) {
		const err = new Error('You are not authorized to view this page.');
		err.status = 403;
		return next(err);
	}

	this.model.findOne(request.session.userId, (err, user) => {
		debug(request.session, user);
		if (err) {
			return next(err);
		}
		if (!user) {
			err = new Error('Not Found');
			err.status = 404;
			return next(err);
		}
		return response.render('profile', { title: 'Profile', name: user.name, favorite: user.favoriteBook });
	});
};

usersController.prototype.logout = function (request, response, next) {
	if (request.session) {
    // delete session object
		request.session.destroy((err) => {
			if (err) {
				return next(err);
			} 
			return response.redirect('/users/login');
		});
	}
};

// List all elements on database - Friendly
usersController.prototype.getAllFriendly = function (request, response, next) {
	this.model.findSorted({}, (err, data) => {   // brings sorted by firstName
	// this.model.find({}, (err, data) => {  // vanilla find
	// this.model.find2({}, { firstName: 1, lastName: 1, _id: 0 }, (err, data) => { // set projection here
		if (err) {
			return next(err);
		} else
			if (data.length) {
				response.render('users', { users: data });
			} else {
				response.send('No documents found');
			}
	});
};

/* *****************************************************************
 *
 * Standard model for mongojs. Keep for all models with no change,
 *  only function name prefix
 *
 * *****************************************************************/

// List all elements on database - JSON, for front-end
usersController.prototype.getAll = function (request, response, next) {
	this.model.find({}, (err, data) => {
		if (err) {
			return next(err);
		}
		response.json(data);
	});
};

usersController.prototype.getById = function (request, response, next) {
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

usersController.prototype.create = function (request, response, next) {
	const body = request.body;
	debug(body);
	this.model.create(body, (err, data) => {
		if (err) {
			return next(err);
		}
		response.json(data);
	});
};

usersController.prototype.update = function (request, response, next) {
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

usersController.prototype.remove = function (request, response, next) {
	const _id = request.params._id;
	this.model.remove(_id, (err, data) => {
		if (err) {
			return next(err);
		}
		response.json(data);
	});
};

module.exports = function (usersModel) {
	return new usersController(usersModel);
};
