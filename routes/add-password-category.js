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




/* GET Add Password Category Page */
router.get('/', checkUserLogin, function (req, res, next) {
    res.render('add_password_category', {
        title: 'Add Password Category - Password Management System',
        msg: '',
        msgclass: '',
        errors: ''
    });
});



/* POST Add Password Category Page */
router.post('/', checkUserLogin, [check('category', 'Password Category must be 3 characters long!').isLength({
    min: 3
})], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.mapped());
        res.render('add_password_category', {
            title: 'Add Password Category - Password Management System',
            msg: '',
            msgclass: '',
            errors: errors.mapped()
        });
    } else {
        var passCategory = req.body.category;

        passCatDetails = new passwordCatModal({
            category: passCategory
        });

        passCatDetails.save((err, doc) => {
            if (err) throw err;
            res.render('add_password_category', {
                title: 'Add Password Category - Password Management System',
                msg: 'Password Category Added Successfully!',
                msgclass: 'alert-success',
                errors: ''
            });
        });
    }
});


module.exports = router;