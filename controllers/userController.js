const passport = require('passport');
const bcrypt = require('bcryptjs');
const async = require('async');
const { body, validationResult } = require('express-validator');

const User = require('../models/user');

/// LOG IN ///
exports.log_in_get = (req, res, next) => {
  res.render('./authentication/log-in', { title: 'Log in' });
};
exports.log_in_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
});

/// LOG OUT ///
exports.log_out_get = (req, res, next) => {
  req.logout();
  res.redirect('/');
};

/// SIGN UP ///
exports.sign_up_get = (req, res, next) => {
  res.render('./authentication/sign-up', { title: 'Sign up' });
};
exports.sign_up_post = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) return next(err);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    }).save((err) => {
      if (err) return next(err);
      res.locals.currentUser = user;
      res.redirect('/');
    });
  });
};
