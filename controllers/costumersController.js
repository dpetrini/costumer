/** costumers Controller
 *   Responds to Express Rourter for /costumers
 *   Receives data  and send to models (database). costumers app
 *   Supports optimization in queries if needed: use Sort or Projection
 *    from Mongo DB
 *
 * @class costumersController
 */

const config = require('config');
const debug = require('debug')(config.get('appName') + ':costumers:controller');

class costumersController {
  constructor(costumersModel) {
      this.model = costumersModel;
  }
  // Receives form with POST and performs UPDATE (or DELETE) in database
    createNew(request, response, next) {
        console.log(request.query)
        console.log(request.body)

        // minimum check
        if (request.body.email !== null) {
            
            // create object with form input
            const costumerData = {
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                contactNumber: request.body.contactNumber,
                address: request.body.address,
                city: request.body.city,
                state: request.body.state,
                email: request.body.email,
            };

            // Save on DB
            // this.create...
            this.model.create(costumerData, (err, data) => {
                debug('Costumers response:', data, err);
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
        // this.model.find({}, (err, data) => {  // vanilla find
        // this.model.find2({}, { firstName: 1, lastName: 1, _id: 0 }, (err, data) => { // set projection here
        if (err) {
            return next(err);
        }
        else if (data.length) {
            response.render('costumers', { costumers: data });
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

} 

module.exports = function (costumersModel) {
    return new costumersController(costumersModel);
};

// ES6 not available yet
// export default costumersController;
