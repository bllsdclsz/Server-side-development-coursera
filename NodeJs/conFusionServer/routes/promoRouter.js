const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
var authenticate = require('../authenticate');

const Promotions = require('../models/promotions');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
      Promotions.find({})
         .then((promotions) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotions);
         }, (err) => next(err))
         .catch((err) => next(err));
   })
   .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      if (req.user.admin) {
         Promotions.create(req.body)
            .then((promotion) => {
               console.log('Promotion Created ', promotion);
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(promotion);
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
         res.end('PUT operation not supported on /promotions');
      } else {
         var err = new Error('You are not authorized to perform this operation!');
         err.status = 403;
         next(err);
      }
   })
   .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      if (req.user.admin) {
         Promotions.remove({})
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

promotionRouter.route('/:promotionId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
      Promotions.findById(req.params.promotionId)
         .then((promotion) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
         }, (err) => next(err))
         .catch((err) => next(err));
   })
   .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      if (req.user.admin) {
         res.statusCode = 403;
         res.end('POST operation not supported on /promotions/' + req.params.promotionId);
      } else {
         var err = new Error('You are not authorized to perform this operation!');
         err.status = 403;
         next(err);
      }
   })
   .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      if (req.user.admin) {
         Promotions.findByIdAndUpdate(req.params.promotionId, {
               $set: req.body
            }, {
               new: true
            })
            .then((promotion) => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(promotion);
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
         Promotions.findByIdAndRemove(req.params.promotionId)
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

module.exports = promotionRouter;