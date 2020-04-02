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




/* GET Register or Signup Page */
router.get('/', isLogin, function (req, res, next) {
    res.render('signup', {
        title: 'Register for Password Management System',
        msg: '',
        msgclass: 'alert-success'
    });
});





var checkFields = [mw.checkUsername, mw.checkEmail, mw.checkPass];
/* POST Register Functionality */
router.post('/', checkFields, function (req, res, next) {
    var username = req.body.uname;
    var email = req.body.email;
    var password = req.body.pass;
    var confirmpass = req.body.cpass;

    // Before inserting we encrypt password
    password = bcrypt.hashSync(req.body.pass, 10);

    var userInsertDetails = new userModal({
        username: username,
        email: email,
        password: password
    });

    userInsertDetails.save((err, doc) => {
        if (err) throw err;
        res.render('signup', {
            title: 'Register for Password Management System',
            msg: 'User Registered Successfully',
            msgclass: 'alert-success'
        });
    });
});


module.exports = router;