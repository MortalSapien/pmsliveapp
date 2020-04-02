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


/* GET Login Page */
router.get('/', isLogin, function (req, res, next) {
  res.render('index', {
    title: 'Password Management System',
    msg: '',
    msgclass: 'alert-success'
  });
});



/* POST Login Page -- Redirecting to Dashboard */
router.post('/', function (req, res, next) {
  var email = req.body.email;
  var upassword = req.body.pass;

  var checkEmailFrDB = userModal.findOne({
    email: email
  });

  checkEmailFrDB.exec((err, data) => {
    if (err) console.log(err);

    if (!data) {
      res.render('index', {
        title: 'Password Management System',
        msg: 'Email not registered!',
        msgclass: 'alert-danger'
      });
    }

    if (data) {
      var getUserId = data._id;
      var user = data.username;

      if (bcrypt.compareSync(upassword, data.password)) {
        var token = jwt.sign({
          userId: getUserId
        }, 'loginToken');

        localStorage.setItem('userToken', token);
        localStorage.setItem('loginUser', user);

        res.redirect('/dashboard');
      } else {
        res.render('index', {
          title: 'Password Management System',
          msg: 'Password not matching!',
          msgclass: 'alert-danger'
        });
      }
    }
  });

});

module.exports = router;