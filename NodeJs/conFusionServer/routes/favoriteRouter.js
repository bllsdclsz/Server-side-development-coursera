const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
var authenticate = require('../authenticate');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
   .options(cors.corsWithOptions, (req, res) => {
      res.sendStatus(200);
   })
   .get(cors.cors, (req, res, next) => {
      Favorites.findOne({user: req.user._id})
         .populate('user')
         .populate('dishes')
         .then((favorites) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
         }, (err) => next(err))
         .catch((err) => next(err));
   })
   .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      Favorites.findOne({_id: req.user._id})
      .then((favorite) => {
         if (favorite) {
            if (favorite.dishes.indexOf(req.body._id) === -1) {
               favorite.dishes.push(req.body._id);
               favorite.save()
               .then((favorite) => {
                  Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
               })
            }, (err) => next(err));
         } else {
               res.statusCode = 403;
               res.end('You added this dish before ' + req.body._id);
         }
      } else {
         Favorites.create({user: req.user, dishes:req.body._id})
            .then((favorite) => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(favorite);
            }, (err) => next(err))
         }
      }, (err) => next(err))
         .catch((err) => next(err));
   })
   .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      Favorites.findOne({user:  req.user._id})
      .populate('user')
      .populate('dishes')
            .then((fav) => {
               if (fav) {
                  Favorites.findOneAndRemove({user: req.user._id})
                  .then((response) => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
         } else {
            res.statusCode = 403;
            res.end('There is nothing to delete')
         }
      }, (err) => next(err))
      .catch((err) => next(err));
   });

favoriteRouter.route('/:dishId')
   .options(cors.corsWithOptions, (req, res) => {
      res.sendStatus(200);
   })
   .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      Favorites.findOne({_id: req.user._id})
      .then((favorite) => {
         if (favorite) {
            if (favorite.dishes.indexOf(req.body._id) === -1) {
               favorite.dishes.push(req.body._id);
               favorite.save()
               .then((favorite) => {
                  Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
               })
            }, (err) => next(err));
         } else {
               res.statusCode = 403;
               res.end('You added this dish before ' + req.body._id);
         }
      } else {
         Favorites.create({user: req.user, dishes:req.body._id})
            .then((favorite) => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(favorite);
            }, (err) => next(err))
         }
      }, (err) => next(err))
         .catch((err) => next(err));
   })
   .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      Favorites.findOne({user:  req.user._id})
      .populate('user')
      .populate('dishes')
            .then((fav) => {
               if (fav) {
                  Favorites.findOneAndRemove({user: req.user._id})
                  .then((response) => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
         } else {
            res.statusCode = 403;
            res.end('There is nothing to delete')
         }
      }, (err) => next(err))
      .catch((err) => next(err));
   });

module.exports = favoriteRouter;