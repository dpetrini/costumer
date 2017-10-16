const express = require('express');
const router = express.Router();
const mid = require('../middleware');

const mongo = require('../db/mongo');
const costumersModel = require('../models/costumersModel')(mongo);
const costumersController = require('../controllers/costumersController')(costumersModel);

// ES6 not available yet
// import propModel from '../models/costumersModel';
// import propController from '../controllers/usersController';
// const costumersModel = new propModel(mongo);
// const costumersController = new propController(costumersModel);

/* LOG IN  */
// router.get('/proposal', mid.loggedOut, (req, res, next) => {
//   res.render('login', { title: 'Login' });
// });
router.post('/', (req, res, next) => { 
  costumersController.createNew(req, res, next);
});

router.get('/', (req, res, next) => { 
  costumersController.getAll(req, res, next);
});

module.exports = router;