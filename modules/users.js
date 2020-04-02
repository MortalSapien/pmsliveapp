// User Modal file
// This file handles the data of user from MongoDB Database: pms

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
var connect = mongoose.connection;

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

var userModel = mongoose.model('user', userSchema);

module.exports = userModel;