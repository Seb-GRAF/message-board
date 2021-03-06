const passport = require('passport');
const bcrypt = require('bcryptjs');
const async = require('async');
const { body, validationResult } = require('express-validator');
const moment = require('moment');

const Message = require('../models/message');
const message = require('../models/message');

/// CREATE MESSAGE ///
exports.create_get = (req, res, next) => {
  if (!req.user) res.redirect('/users/log-in');

  res.render('./message/message-form', { title: 'New message' });
};
exports.create_post = [
  body('title', 'Please add a title').trim().isLength({ min: 1 }).escape(),
  body('message', 'Please add a message (maximum 256 characters)')
    .trim()
    .isLength({ min: 1, max: 256 }),

  (req, res, next) => {
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      message: req.body.message,
      user: req.user._id,
      date: moment(new Date()).format('DD MMMM YYYY - h:mma'),
    });

    if (!errors.isEmpty()) {
      res.render('./message/message-form', {
        title: 'Create message',
        errors: errors.array({ onlyFirstError: true }),
        message_title: req.body.title,
        message: req.body.message,
      });
      return;
    } else {
      message.save((err) => {
        if (err) return next(err);
        res.redirect('/messages');
      });
    }
  },
];

/// EDIT MESSAGE ///
exports.edit_get = (req, res, next) => {
  async.parallel(
    {
      message: (callback) => Message.findById(req.params.id).exec(callback),
    },
    (err, results) => {
      if (err) return next(err);

      if (results.message == null) {
        let err = new Error('Message not found');
        err.status = 404;
        return next(err);
      }
      if (!req.user) {
        res.redirect('/');
      } else if (`${req.user._id}` !== `${results.message.user}`)
        res.redirect('/');
      else
        res.render('./message/message-edit', {
          title: 'Edit message',
          message: results.message,
        });
    }
  );
};
exports.edit_post = [
  body('title', 'Please add a title').trim().isLength({ min: 1 }).escape(),
  body('message', 'Please add a message (maximum 256 characters)')
    .trim()
    .isLength({ min: 1, max: 256 }),

  (req, res, next) => {
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      message: req.body.message,
      user: req.user._id,

      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          message: (callback) => Message.findById(req.params.id).exec(callback),
        },
        (err, results) => {
          if (err) return next(err);

          if (results.message == null) {
            let err = new Error('Message not found');
            err.status = 404;
            return next(err);
          }

          res.render('./message/message-edit', {
            title: 'Edit message',
            message: results.message,
            errors: errors.array({ onlyFirstError: true }),
            message_title: req.body.title,
          });
        }
      );
      return;
    } else {
      Message.findByIdAndUpdate(req.params.id, message, (err) => {
        if (err) return next(err);
        res.redirect('/messages');
      });
    }
  },
];

/// DELETE MESSAGE ///
exports.delete_get = (req, res, next) => {
  async.parallel(
    {
      message: (callback) =>
        Message.findById(req.params.id).populate('user').exec(callback),
    },
    (err, results) => {
      if (err) return next(err);

      // No results
      if (results.message == null) res.redirect('/messages');

      // on success
      res.render('./message/message-delete', {
        message: results.message,
        title: 'Delete message',
      });
    }
  );
};
exports.delete_post = (req, res, next) => {
  async.parallel(
    {
      message: (callback) =>
        Message.findById(req.body.messageid).exec(callback),
    },
    (err, results) => {
      if (err) return next(err);

      // on success
      Message.findByIdAndRemove(
        req.body.messageid,
        function deleteProduct(err) {
          if (err) return next(err);
          res.redirect('/messages');
        }
      );
    }
  );
};

/// LIST MESSAGES ///
exports.list_all = (req, res, next) => {
  async.parallel(
    {
      messages: (callback) =>
        Message.find().sort({ createdAt: -1 }).populate('user').exec(callback),
    },
    (err, results) => {
      if (err) return next(err);
      let dateObj = results.messages;
      // on success
      res.render('./message/message-list', {
        messages: results.messages,
        title: 'All messages',
      });
    }
  );
};
