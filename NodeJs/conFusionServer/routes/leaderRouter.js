const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
var authenticate = require('../authenticate');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
      Leaders.find({})
         .then((leaders) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leaders);
         }, (err) => next(err))
         .catch((err) => next(err));
   })
   .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      if (req.user.admin) {
         Leaders.create(req.body)
            .then((leader) => {
               console.log('Leader Created ', leader);
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
      } else {
         var err = new Error('You are not authorized to perform this operation!');
         err.status = 403;
         next(err);
      }
   })
   .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      if (req.user.admin) {
         res.statusCode = 403;
         res.end('PUT operation not supported on /leaders');
      } else {
         var err = new Error('You are not authorized to perform this operation!');
         err.status = 403;
         next(err);
      }
   })
   .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      if (req.user.admin) {
         Leaders.remove({})
            .then((resp) => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
      } else {
         var err = new Error('You are not authorized to perform this operation!');
         err.status = 403;
         next(err);
      }
   });

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
      Leaders.findById(req.params.leaderId)
         .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
         }, (err) => next(err))
         .catch((err) => next(err));
   })
   .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      if (req.user.admin) {
         res.statusCode = 403;
         res.end('POST operation not supported on /leaders/' + req.params.leaderId);
      } else {
         var err = new Error('You are not authorized to perform this operation!');
         err.status = 403;
         next(err);
      }
   })
   .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      if (req.user.admin) {
         Leaders.findByIdAndUpdate(req.params.leaderId, {
               $set: req.body
            }, {
               new: true
            })
            .then((leader) => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
      } else {
         var err = new Error('You are not authorized to perform this operation!');
         err.status = 403;
         next(err);
      }
   })
   .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      if (req.user.admin) {
         Leaders.findByIdAndRemove(req.params.leaderId)
            .then((resp) => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
      } else {
         var err = new Error('You are not authorized to perform this operation!');
         err.status = 403;
         next(err);
      }
   });

module.exports = leaderRouter;