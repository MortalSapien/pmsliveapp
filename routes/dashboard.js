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




/* GET Dashboard Page */
router.get('/', checkUserLogin, function (req, res, next) {
    var user = localStorage.getItem('loginUser');

    res.render('dashboard', {
        title: 'Dashboard - Password Management System',
        msg: '',
        user: user
    });
});


module.exports = router;