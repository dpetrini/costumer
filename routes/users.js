const express = require('express');
const router = express.Router();
const mid = require('../middleware');

const mongo = require('../db/mongo');
const usersModel = require('../models/usersModel')(mongo);
const usersController = require('../controllers/usersController')(usersModel);

/* LOG IN  */
router.get('/login', mid.loggedOut, (req, res, next) => {
  res.render('login', { title: 'Login' });
});
router.post('/login', usersController.authenticate.bind(usersController));
router.post('/loginclient', usersController.authenticateClient.bind(usersController));

/* REGISTER */
router.get('/register', mid.loggedOut, (req, res, next) => {
    res.render('register', { title: 'Sign Up' });
  });
router.post('/register', usersController.createNew.bind(usersController));

/* PROFILE */
router.get('/profile', mid.requiresLogin, usersController.showProfile.bind(usersController));

/* LOGOUT */
router.get('/logout', usersController.logout.bind(usersController));
router.get('/logoutclient', usersController.logoutClient.bind(usersController));

module.exports = router;