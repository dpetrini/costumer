/** proposals Model
 *   Access layer for Mongo DB - using Mongojs
 *   Receives data  and send to models (database). proposals app
 *   Supports optimization in queries if needed: use Sort or Projection
 *    from Mongo DB
 *
 * @class proposalsModel
 */

const config = require('config');
const debug = require('debug')(config.get('appName') + ':proposals:Model');

class proposalsModel {
    constructor(mongo) {
        this.mongo = mongo;
        // this.mongo.collection('proposals').createIndex({ "email": 1 }, { "unique": true });
    }
    find(query, callback) {
        this.mongo.collection('proposals').find(query, callback);
    }
    // Sort By the indicated field
    findSorted(query, callback) {
        this.mongo.collection('proposals').find(query).sort({ firstName: 1 }, callback);
    }
    // Sorting descending (-1) with projection
    findSortedProjection(query, callback) {
        this.mongo.collection('proposals').find(query, { firstName: 1, lastName: 1, _id: 0 }).sort({ firstName: -1 }, callback);
    }
    // End of special guys
    findOne(_id, callback) {
        const query = { _id: this.mongo.ObjectId(_id) };
        this.mongo.collection('proposals').findOne(query, callback);
    }
    create(data, callback) {
        debug('Insert data:' + data);
        this.mongo.collection('proposals').insert(data, callback);
    }
    update(_id, data, callback) {
        const query = { _id: this.mongo.ObjectId(_id) };
        debug(' update:' + JSON.stringify(query));
        this.mongo.collection('proposals').update(query, data, callback);
    }
    remove(_id, callback) {
        const query = { _id: this.mongo.ObjectId(_id) };
        this.mongo.collection('proposals').remove(query, callback);
    }
}

module.exports = function (mongo) {
  return new proposalsModel(mongo);
};
