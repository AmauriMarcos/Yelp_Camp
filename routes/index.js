var express = require('express');
var router  = express.Router();
var passport= require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req, res){
    res.render("landing");
});


// Show register form
router.get('/register', function(req, res){
    res.render('register')
});

//Handle sign up logic
router.post('/register',function(req, res){
    var newUser = new User({username: req.body.username});
    var password = req.body.password;
    User.register(newUser, password, function(err,user){
        if(err){
            //req.flash("error", err.message);
           // return res.render('register')
           return res.render('register', {error: err.message});
        } 
        passport.authenticate('local')(req, res, function(){
            req.flash("success", "Welcome to YelpCamp" + user.username);
            res.redirect('/campgrounds');
        });
    });
});

// Show login form
router.get('/login', function(req, res){
    res.render('login');
});

//Handling logic login
router.post('/login', function(req, res, next) {
     passport.authenticate('local',
     {
        successRedirect: '/campgrounds',
        failureRedirect: '/login',
        failureFlash   : true,
        successFlash   : "Welcome to YelpCamp, " + req.body.username + "!"
     })(req, res);
});

//Logout route
router.get('/logout', function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect('/campgrounds');
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;