const express = require('express');
const router = express.Router();
const mid = require('../middleware');

const mongo = require('../db/mongo');
const proposalsModel = require('../models/proposalsModel')(mongo);
const proposalsController = require('../controllers/proposalsController')(proposalsModel);

// ES6 not available yet
// import propModel from '../models/proposalsModel';
// import propController from '../controllers/usersController';
// const proposalsModel = new propModel(mongo);
// const proposalsController = new propController(proposalsModel);

/* LOG IN  */
// router.get('/proposal', mid.loggedOut, (req, res, next) => {
//   res.render('login', { title: 'Login' });
// });
router.get('/', (req, res, next) => { 
  proposalsController.createNew(req, res, next);
});

module.exports = router;