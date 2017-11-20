var express = require('express');
var app = express();
var mongoose = require('mongoose');
var config = require('./config/database');
var path = require('path');

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

app.use(express.static(__dirname + '/client/dist/'));

app.get('*', function (req, res) {

  res.sendFile(path.join(__dirname + '/client/dist/index.html'));

});

app.listen(8080, function() {

	console.log('Listening on port 8080');

});