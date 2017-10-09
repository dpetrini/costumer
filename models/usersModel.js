/** users Model
 *   Access layer for Mongo DB - using Mongojs
 *   Receives data  and send to models (database). users app
 *   Supports optimization in queries if needed: use Sort or Projection
 *    from Mongo DB
 *
 * @module usersModel
 */

const config = require('config');
const debug = require('debug')(config.get('appName') + ':users:Model');

function usersModel (mongo) {
	this.mongo = mongo;
	this.mongo.collection('users').createIndex({ "email": 1 }, { "unique": true });
}
usersModel.prototype.find = function (query, callback) {
	this.mongo.collection('users').find(query, callback);
};

// Special guys to be used by controllers -- passar para controller algo??

// Sends projection to controllers, as a parameter (may be the best option to
//   be followed by others, we don´t want to see field names here).
usersModel.prototype.find2 = function (query, projection, callback) {
	this.mongo.collection('users').find(query, projection, callback);
};
// Projection: select the fields that will return
usersModel.prototype.findProjection = function (query, callback) {
	this.mongo.collection('users').find(query, { firstName: 1, lastName: 1, _id: 0 }, callback);
};
// Limit number of returned docs. (can use skip too)
usersModel.prototype.find50 = function (query, callback) {
	this.mongo.collection('users').find(query).limit(50, callback);
};
// Sort By the indicated field
usersModel.prototype.findSorted = function (query, callback) {
	this.mongo.collection('users').find(query).sort({ firstName: 1 }, callback);
};
// Sorting descending (-1) with projection
usersModel.prototype.findSortedProjection = function (query, callback) {
	this.mongo.collection('users').find(query, { firstName: 1, lastName: 1, _id: 0 }).sort({ firstName: -1 }, callback);
};
// End of special guys

usersModel.prototype.findOne = function (_id, callback) {
	const query = { _id: this.mongo.ObjectId(_id) };
	this.mongo.collection('users').findOne(query, callback);
};
usersModel.prototype.create = function (data, callback) {
	debug('Insert data:' + data);
	this.mongo.collection('users').insert(data, callback);
};
usersModel.prototype.update = function (_id, data, callback) {
	const query = { _id: this.mongo.ObjectId(_id) };
	debug(' update:' + JSON.stringify(query));
	this.mongo.collection('users').update(query, data, callback);
};
usersModel.prototype.remove = function (_id, callback) {
	const query = { _id: this.mongo.ObjectId(_id) };
	this.mongo.collection('users').remove(query, callback);
};
module.exports = function (mongo) {
	return new usersModel(mongo);
};
