var userModal = require('../modules/users');

/* Middleware for checking Username Duplication */
function checkUsername(req, res, next) {
    var username = req.body.uname;
    var userFromDB = userModal.findOne({
        username: username
    });

    userFromDB.exec((err, data) => {
        if (err) throw err;
        if (data) {
            return res.render('signup', {
                title: 'Register for Password Management System',
                msg: 'Username Already Exists!',
                msgclass: 'alert-danger'
            });
        }
        next();
    });
}

/* Middleware for checking Email field duplication from Database */
function checkEmail(req, res, next) {
    var email = req.body.email;
    var DBemail = userModal.findOne({
        email: email
    });

    DBemail.exec((err, data) => {
        if (err) throw err;
        if (data) {
            return res.render('signup', {
                title: 'Register for Password Management System',
                msg: 'Email Already Exists!',
                msgclass: 'alert-danger'
            });

        }
        next();
    });
}


/* Middleware for checking Password and confirm Password is same */
function checkPass(req, res, next) {
    var password = req.body.pass;
    var confirmpassword = req.body.cpass;

    if (req.body.pass != req.body.cpass) {
        return res.render('signup', {
            title: 'Register for Password Management System',
            msg: 'Confirm Password not matched!',
            msgclass: 'alert-danger'
        });
    }
    next();
}


///// Exporting Middlware to Main router with same names
module.exports.checkUsername = checkUsername;
module.exports.checkEmail = checkEmail;
module.exports.checkPass = checkPass;