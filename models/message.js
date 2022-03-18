const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: {
    type: String,
    default: moment(new Date()).format('DD MMMM YYYY - h:mma'),
  },
});

module.exports = mongoose.model('Message', MessageSchema);
