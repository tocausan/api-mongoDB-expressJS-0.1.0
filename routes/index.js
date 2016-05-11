/**
 * Index route
 * GET
 * POST
 */

var express = require('express'),
    router = express.Router();

module.exports = router;

/**
 * Root
 */
router.get('/', function(req, res, next) {
    console.log('##### routes/index.js : router.route(/)');

    res.render('index', {
        title: 'Base',
        description: 'NodeJS application using ExpressJS, mongoDB and Foundation.'
    });
});
