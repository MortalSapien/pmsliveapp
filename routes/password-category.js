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




/* GET All Password Category Page */
router.get('/', checkUserLogin, function (req, res, next) {
    getAllPassCat.exec((err, data) => {
        if (err) throw err;
        res.render('password_category', {
            title: 'Password Category - Password Management System',
            msg: '',
            records: data
        });
    });
});




/* GET Delete Password Category Functionality */
router.get('/delete/:id', checkUserLogin, function (req, res, next) {
    var deletePassCatById = passwordCatModal.findByIdAndDelete(req.params.id);

    deletePassCatById.exec((err) => {
        if (err) throw err;

        getAllPassCat.exec((err, data) => {
            if (err) throw err;
            res.render('password_category', {
                title: 'Password Category - Password Management System',
                msg: 'Password Category Deleted Successfully!',
                records: data
            });
        });
    });
});



/* GET Edit Functionality Accessed for Password Category Page */
router.get('/edit/:id', checkUserLogin, function (req, res, next) {
    var getOnePassCatDetail = passwordCatModal.findById(req.params.id);

    getOnePassCatDetail.exec((err, data) => {
        if (err) throw err;
        res.render('edit_password_category', {
            title: 'Edit Password Category - Password Management System',
            msg: '',
            records: data
        });
    });
});



/* GET Update Password Category Functionality */
router.post('/update', checkUserLogin, function (req, res, next) {
    var up_id = req.body.id;
    var up_passCat = req.body.category;

    var updatePassCat = passwordCatModal.findByIdAndUpdate(up_id, {
        $set: {
            category: up_passCat
        }
    });

    updatePassCat.exec((err, data) => {
        if (err) throw err;

        getAllPassCat.exec((err, data) => {
            if (err) throw err;
            res.render('password_category', {
                title: 'Password Category - Password Management System',
                msg: 'Password Category Updated!',
                records: data
            });
        });
    });
});


module.exports = router;