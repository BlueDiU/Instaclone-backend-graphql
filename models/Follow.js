const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowSchema = Schema({
  /* My username id */
  idUser: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  },
  /* UserId that i want to follow */
  follow: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Follow', FollowSchema);
