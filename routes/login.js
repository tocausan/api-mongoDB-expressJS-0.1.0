/**
 * Login
 *
 * Route schema
 *  /login
 *      GET
 *      POST
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model('user'),
    Password = mongoose.model('password');

module.exports = router;

/**
 * Log middelware
 */
router.use(function(req, res, next) {
    console.log('##### log middelware');
    console.log('#####', req.method, req.url);

    if(!req.session.user || (req.url == '/out')){
        next();
    }
    else{
        res.format({
            // HTML response
            html: function(){
                res.redirect("/");
            },
            //JSON response
            json: function(){
                res.json('access allowed');
            }
        });
    }
});




/**
 * Login index
 */
router.route('/')

    // GET login form
    .get(function(req, res, next) {
        console.log('#####', 'routes/login.js', 'router.route(/login)');

        res.format({
            // HTML response
            html: function(){
                res.render('login/index', {
                    title: 'Login'
                });
            }
        });

        /**
         * Root user (Delete it on production)
         */
        var root = {
            username: 'root',
            firstname: 'root',
            lastname: 'root',
            password: 'root'
        };

        User.findOne({'username': root.username}, function (err, user) {
            if (user) {
                console.log('root already exist.');
                console.log(user);
            }
            else{
                // Add user
                User.create({
                    username: root.username,
                    firstname: root.firstname,
                    lastname: root.lastname
                }, function (err, small) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('Root user created');

                        User.findOne({'username': root.username}, function (err, user) {

                            // Add password
                            Password.create({
                                user: user._id,
                                password: root.password
                            }, function (err, small) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    console.log('Root password created');
                                }
                            })
                        })
                    }
                })
            }
        });

    })

    // POST user
    .post(function(req, res) {

        User.findOne({ 'username': req.body.username }, function (err, user){
            console.log(user);

            Password.find({ 'user': user._id }, function (err, password){
                console.log(password);
                if(user && password){

                    req.session.user = user;

                    res.format({
                        html: function(){
                            res.location("user");
                            res.redirect("/user");
                        }
                    });
                }
                else{
                    res.format({
                        // HTML response
                        html: function(){
                            res.render('login/index', {
                                title: 'Login',
                                error: 'Wrong username or password'
                            });
                        }
                    });
                }
            })
        });
    });



router.route('/out')

    // GET login form
    .get(function(req, res, next){
        res.format({
            // HTML response
            html: function(){
                delete req.session.user;
                res.redirect("/");
            },
            //JSON response
            json: function(){
                res.json('Bye bye');
            }
        });
    });