const express = require('express');
const router = express.Router();

const mongo = require('../db/mongo');
const proposalsModel = require('../models/proposalsModel')(mongo);
const proposalsController = require('../controllers/proposalsController')(proposalsModel);

// Retrieve proposal from db
router.get('/', (req, res, next) => { 
  proposalsController.getAll(req, res, next);
});

// Store proposal
router.post('/', (req, res, next) => { 
  proposalsController.createNew(req, res, next);
});

// Send email and store proposal in database
router.post('/email', (req, res, next) => { 
  proposalsController.sendProposalEmail(req, res, next);
});

module.exports = router;