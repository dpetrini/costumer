/*
  Model
  Access layer for Mongo DB - using Mongojs

  It includes some special guys tailored for the application

*/

const debug = require('debug')('donors:Model');

function donorsModel (mongo) {
	this.mongo = mongo;
}
donorsModel.prototype.find = function (query, callback) {
	this.mongo.collection('donors').find(query, callback);
};

// Special guys to be used by controllers -- passar para controller algo??

// Sends projection to controllers, as a parameter (may be the best option to
//   be followed by others, we don´t want to see field names here).
donorsModel.prototype.find2 = function (query, projection, callback) {
	this.mongo.collection('donors').find(query, projection, callback);
};
// Projection: select the fields that will return
donorsModel.prototype.findProjection = function (query, callback) {
	this.mongo.collection('donors').find(query, { firstName: 1, lastName: 1, _id: 0 }, callback);
};
// Limit number of returned docs. (can use skip too)
donorsModel.prototype.find50 = function (query, callback) {
	this.mongo.collection('donors').find(query).limit(50, callback);
};
// Sort By the indicated field
donorsModel.prototype.findSorted = function (query, callback) {
	this.mongo.collection('donors').find(query).sort({ firstName: 1 }, callback);
};
// Sorting descending (-1) with projection
donorsModel.prototype.findSortedProjection = function (query, callback) {
	this.mongo.collection('donors').find(query, { firstName: 1, lastName: 1, _id: 0 }).sort({ firstName: -1 }, callback);
};
// End of special guys

donorsModel.prototype.findOne = function (_id, callback) {
	const query = { _id: this.mongo.ObjectId(_id) };
	this.mongo.collection('donors').findOne(query, callback);
};
donorsModel.prototype.create = function (data, callback) {
	debug('Insert data:' + data);
	this.mongo.collection('donors').insert(data, callback);
};
donorsModel.prototype.update = function (_id, data, callback) {
	const query = { _id: this.mongo.ObjectId(_id) };
	debug(' update:' + JSON.stringify(query));
	this.mongo.collection('donors').update(query, data, callback);
};
donorsModel.prototype.remove = function (_id, callback) {
	const query = { _id: this.mongo.ObjectId(_id) };
	this.mongo.collection('donors').remove(query, callback);
};
module.exports = function (mongo) {
	return new donorsModel(mongo);
};
