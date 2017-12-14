/** proposals Controller
 *   Responds to Express Rourter for /proposals
 *   Receives data  and send to models (database). proposals app
 *   Supports optimization in queries if needed: use Sort or Projection
 *    from Mongo DB
 *   
 *   Send email of proposal using lib/sendmail.js (nodemailer)
 *
 * @class proposalsController
 */

const config = require('config');
const debug = require('debug')(config.get('appName') + ':proposals:controller');
const transporter = require('../lib/sendmail');

class proposalsController {
    constructor(proposalsModel) {
        this.model = proposalsModel;
    }

    // Receives form with POST and performs UPDATE (or DELETE) in database
    createNew(request, response, next) {
        if (request.body.email !== null) {
            // Save on DB
            this.model.create(request.body, (err, data) => {
                debug('Proposal Response:', data, err);
                if (err) {
                    return next(err);
                }
                return response.json(data);
                });
        }
        else {
            const err = new Error('All fields required.');
            err.status = 400;
            return next(err);
        }
    }

    // List all elements on database - Friendly
    getAllFriendly(request, response, next) {
        this.model.findSorted({}, (err, data) => {
            if (err) {
                return next(err);
            }
            else if (data.length) {
                response.render('proposals', { proposals: data });
            }
            else {
                response.send('No documents found');
            }
        });
    }
    /* *****************************************************************
    *
    * Standard model for mongojs. Keep for all models with no change,
    *  only function name prefix
    *
    * *****************************************************************/
    // List all elements on database - JSON, for front-end
    getAll(request, response, next) {
        this.model.find({}, (err, data) => {
            if (err) {
                return next(err);
            }
            response.json(data);
        });
    }

    getById(request, response, next) {
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
    }

    create(request, response, next) {
        const body = request.body;
        debug(body);
        this.model.create(body, (err, data) => {
            if (err) {
                return next(err);
            }
            response.json(data);
        });
    }

    update(request, response, next) {
        const _id = request.params._id;
        const body = request.body;
        this.model.update(_id, body, (err, data) => {
            if (err) {
                return next(err);
            }
            debug(` update response:${JSON.stringify(data)}`);
            response.json(data);
        });
    }

    remove(request, response, next) {
        const _id = request.params._id;
        this.model.remove(_id, (err, data) => {
            if (err) {
                return next(err);
            }
            response.json(data);
        });
    }

    // Sends email with proposal and stores it in db.
    // TODO: save image (or contentHTML in other document?)
    sendProposalEmail(request, response, next) {
        debug(`Send Email: ${ request.body.email } }`);

        // Firstly save on DB
        this.model.create(request.body, (err, data) => {
            debug('Proposal Response:', data, err);
            if (err) {
                return next(err);
            }
            //return response.json(data);
            sendEmail('Proposta ao cliente ', request.body.contentHTML, request, (err, data) => {
                if (err) {
                    return next(err);
                }
                response.json(data);
            });
        });
    }


}

module.exports = function (proposalsModel) {
return new proposalsController(proposalsModel);
};

// ES6 not available yet
// export default proposalsController;

/**
 * Implements email sending for controllers
 * @param {String} action - The reason why we send an email, eg. test, alert, etc
 * @param {Obj} request - Request parameter from Express
 * @param {function} callback - Callback
 * @returns {None} - By callback
 */
function sendEmail (action, contentHTML, request, callback) {
	if (!validateEmail(request.body.email)) {
		const err = new Error('Forbidden');
		err.status = 403;
		callback(err);  // Unprocessable Entity
	}

  // setup email data with unicode symbols
	const mailOptions = {
		from: '"Solar Cost server ☼ " <dp.domotica@gmail.com>', // sender address
		to: request.body.email, // list of receivers
        subject: `${ action } email from Solar Cost `, // Subject line
        text: 'Please confirm to tempmon administrator the reception of this message', // plain text body
        html: contentHTML // html body
	};

  // send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
			callback(error);
		}
		debug('Message %s sent: %s', info.messageId, info.response);
		callback(null, {
			node_id: request.query.node_id,
			result: 'OK',
		});
	});
}

/**
 * Implements email format validation
 * @param {String} email - Email to be validated
 * @returns {Boolean} - `true` if fine, `false` if nor properly email address template
 */
function validateEmail (email) {
	const re = /\S+@\S+\.\S+/;
	return re.test(email);
}
// More complete:
// var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

