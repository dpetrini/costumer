const express = require('express'),
	router = express.Router();

router.get('/main', (request, response) => {
	response.status(201);
	response.json({
		name: 'Daniel Petrini',
		email: 'd.pensator@gmail.com',
	});
});

// Overall check
router.use('/check', require('./check'));

// Sign Up/ Login / Profile / Logout
router.use('/users', require('./users'));

// Sign Up/ Login / Profile / Logout
router.use('/proposals', require('./proposals'));

// Costumers collection
router.use('/costumers', require('./costumers'));

module.exports = router;
