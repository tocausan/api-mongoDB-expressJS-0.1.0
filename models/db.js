var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/api', function(err) {
    if (err) throw err;
});