var express = require('express');
var router = express.Router();
var {
    check,
    validationResult
} = require('express-validator');

var userModal = require('../modules/users');
var passwordCatModal = require('../modules/pass_category');
var addPassModel = require('../modules/add_password');
var bcrypt = require('bcryptjs');
var getAllPassCat = passwordCatModal.find({});
var getAllPassDetails = addPassModel.find({});

var mw = require('../middleware/signup_middleweare');

var jwt = require('jsonwebtoken');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

router.use(express.static('public'));


/* Middleware for Checking Login and redirecting to Dashboard for non-Admin related pages */
function isLogin(req, res, next) {
    try {
        var userToken = localStorage.getItem('userToken');
        var decoded = jwt.verify(userToken, 'loginToken');
        res.redirect('/dashboard');
    } catch (err) {
        // Nothing
    }
    next();
}


/* Middleware for Checking Login Authentication on every Admin related pages */
function checkUserLogin(req, res, next) {
    try {
        var userToken = localStorage.getItem('userToken');
        var decoded = jwt.verify(userToken, 'loginToken');
    } catch (err) {
        res.redirect('/');
    }
    next();
}




/* GET Add new Password Page */
router.get('/', checkUserLogin, function (req, res, next) {
    getAllPassCat.exec((err, data) => {
        if (err) throw err;
        res.render('add_password', {
            title: 'Add New Password - Password Management System',
            msg: '',
            records: data
        });
    });
});




/* POSt Add new Password Page -- Submitting Password Details*/
router.post('/', checkUserLogin, function (req, res, next) {
    var category = req.body.category;
    var password_detail = req.body.password_detail;

    var passDetailsInsert = new addPassModel({
        category: category,
        password_detail: password_detail
    });

    passDetailsInsert.save((err, doc) => {
        if (err) throw err;

        getAllPassCat.exec((err, data) => {
            if (err) throw err;
            res.render('add_password', {
                title: 'Add New Password - Password Management System',
                msg: 'Password Details Saved Successfully',
                records: data
            });
        });
    });
});


module.exports = router;