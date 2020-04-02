// Password Category Modal file
// This file handles the data of Password Category from MongoDB Database: pms

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
var connect = mongoose.connection;

var Schema = mongoose.Schema;

var passwordCatSchema = new Schema({
    category: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

var passwordCatModel = mongoose.model('password_categories', passwordCatSchema);

module.exports = passwordCatModel;