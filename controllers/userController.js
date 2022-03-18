const passport = require('passport');
const bcrypt = require('bcryptjs');
const async = require('async');
const { body, check, validationResult } = require('express-validator');

const User = require('../models/user');

/// LOG IN ///
exports.log_in_get = (req, res, next) => {
  res.render('./authentication/log-in', { title: 'Log in' });
};
exports.log_in_post = (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) return next(err);
    if (!user) {
      return res.render('./authentication/log-in', {
        title: 'Log in',
        message: info.message,
        username: req.body.username,
      });
    }
    req.logIn(user, function (err) {
      if (err) return next(err);
      return res.redirect('/messages');
    });
  })(req, res, next);
};
// exports.log_in_post = passport.authenticate('local', {
//   successRedirect: '/messages',
//   failureRedirect: '/users/log-in',
// });

/// LOG OUT ///
exports.log_out_get = (req, res, next) => {
  req.logout();
  res.redirect('/');
};

/// SIGN UP ///
exports.sign_up_get = (req, res, next) => {
  res.render('./authentication/sign-up', { title: 'Sign up' });
};
exports.sign_up_post = [
  body('first_name', 'Please fill in first name.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('last_name', 'Please fill in last name.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  check(
    'username',
    'Username can not contain special characters and must be between 1 and 12 characters long.'
  )
    .custom((value, { req }) => {
      return User.findOne({
        username: req.body.username,
      }).then((user) => {
        if (user) throw new Error('Username already taken');
      });
    })
    .isAlphanumeric()
    .trim()
    .isLength({ min: 1, max: 12 })
    .escape(),

  body('password', 'Password must be 6 characters long minimum.')
    .trim()
    .isLength({ min: 6 })
    .escape(),

  check('confirm_password').custom((value, { req }) => {
    if (req.body.confirm_password !== req.body.password)
      throw new Error('Passwords must match.');
    return true;
  }),

  // after validation
  (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      res.render('./authentication/sign-up', {
        title: 'Sign up',
        errors: errors.array({ onlyFirstError: true }),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
      });
      return;
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
        }).save((err) => {
          if (err) return next(err);

          passport.authenticate('local', {
            successRedirect: '/messages',
            failureRedirect: '/users/log-in',
          });

          res.redirect('/');
        });
      });
    }
  },
];
