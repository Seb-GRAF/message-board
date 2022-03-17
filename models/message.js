const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);
