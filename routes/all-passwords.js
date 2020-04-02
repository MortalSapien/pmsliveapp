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




/* GET Show all Password details Page */
router.get('/', checkUserLogin, function (req, res, next) {
    var perPage = 1;
    var page = req.params.page || 1;

    addPassModel.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage).exec((err, data) => {
            if (err) throw err;
            addPassModel.countDocuments({}).exec((err, count) => {
                res.render('all_passwords', {
                    title: 'All Passwords - Password Management System',
                    msg: '',
                    records: data,
                    current: page,
                    pages: Math.ceil(count / perPage)
                });
            });
        });
});



/* GET Show all Password details Page */
router.get('/:page', checkUserLogin, function (req, res, next) {
    var perPage = 1;
    var page = req.params.page || 1;

    addPassModel.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage).exec((err, data) => {
            if (err) throw err;
            addPassModel.countDocuments({}).exec((err, count) => {
                res.render('all_passwords', {
                    title: 'All Passwords - Password Management System',
                    msg: '',
                    records: data,
                    current: page,
                    pages: Math.ceil(count / perPage)
                });
            });
        });
});




/* GET Delete Password details functionality */
router.get('/delete/:id', checkUserLogin, function (req, res, next) {
    var deletePassDetailsById = addPassModel.findByIdAndDelete(req.params.id);

    deletePassDetailsById.exec((err) => {
        if (err) throw err;
        res.redirect('/all-passwords');
    });
});



/* GET Edit Password details Page Loaded */
router.get('/edit/:id', checkUserLogin, function (req, res, next) {
    var getPassDetailById = addPassModel.findById(req.params.id);

    getPassDetailById.exec((err, data) => {
        if (err) throw err;

        getAllPassCat.exec((err, catData) => {
            if (err) throw err;

            res.render('edit_password_detail', {
                title: 'Edit Password Detail - Password Management System',
                msg: '',
                records: data,
                catRecords: catData
            });
        });
    });
});


/* POST Update Password details to Database */
router.post('/update', checkUserLogin, function (req, res, next) {
    var update_id = req.body.id;
    var update_category = req.body.category;
    var update_password_detail = req.body.password_detail;

    var updatePassDetailById = addPassModel.findByIdAndUpdate(update_id, {
        category: update_category,
        password_detail: update_password_detail
    });

    updatePassDetailById.exec((err, data) => {
        if (err) throw err;
        res.redirect('/all-passwords');
    });
});




module.exports = router;