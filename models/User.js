const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({});

module.exports = mongoose.model('User', UserSchema);
