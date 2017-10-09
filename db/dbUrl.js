/**
 * @fileOverview Construct mongo db url.
 */

const config = require('config');
const debug = require('debug')(config.get('appName') + ':dbUrl');

/**
 * Use config package: Read files in config dir, according to environment
 * Needs MONGO DB user and password in invironment.
 */
function dbConnection () {

  // env
	if (!(process.env.MONGODB_USER && process.env.MONGODB_PASSWD)) {
    console.log('MONGODB CONNECTION USER/PASSWD environment variables required.');
    process.exit(1);
	}

	const username = process.env.MONGODB_USER.trim(),
		password = process.env.MONGODB_PASSWD.trim(),
		server = config.get('mongo.server'),
		port = config.get('mongo.port'),
		database = config.get('mongo.database'),
		ssl = config.get('mongo.ssl'),
		replicaset = config.get('mongo.replicaset'),
		auth = username ? username + ':' + password + '@' : '';

	const temp = 'mongodb://' + auth + server + ':' + port + replicaset + '/' + database + ssl;
	debug(`Connection: ${ temp }`);

	return temp;
}

module.exports = dbConnection;