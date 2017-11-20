var express = require('express');
var app = express();
var mongoose = require('mongoose');
var config = require('./config/database');

//mongoose.Promise = global.Promise;

mongoose.connect(config.uri, 

	{ useMongoClient: true, 

	}, function(err){

	if (err) {

 		console.log('Could not connect to database: ', err);
	}else {

		console.log('Connected to database: ' + config.db);

	}
});

app.get('*', function (req, res) {

  res.send('<h1>Hello Daniel!</h1>');

});

app.listen(8080, function() {

	console.log('Listening on port 8080');

});