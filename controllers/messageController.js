const passport = require('passport');
const bcrypt = require('bcryptjs');
const async = require('async');
const { body, validationResult } = require('express-validator');
const moment = require('moment');

const Message = require('../models/message');

exports.create_get = (req, res, next) => {
  if (!req.user) res.redirect('/users/log-in');

  res.render('./message/message-form', { title: 'New message' });
};
exports.create_post = (req, res, next) => {
  console.log(req);
  const message = new Message({
    title: req.body.title,
    message: req.body.message,
    user: req.user._id,
  }).save((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
};

exports.list_all = (req, res, next) => {
  async.parallel(
    {
      messages: (callback) =>
        Message.find().sort({ createdAt: 1 }).populate('user').exec(callback),
    },
    (err, results) => {
      if (err) return next(err);
      console.log(results.messages);
      // on success
      res.render('./message/message-list', {
        messages: results.messages,
        createdAt: moment(results.messages.createdAt).format('D MMMM YYYY'),
        updatedAt: moment(results.messages.updatedAt).format('D MMMM YYYY'),
        title: 'All messages',
      });
    }
  );
};
