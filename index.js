var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var config = require('./config/database');
var path = require('path');
var authentication = require('./routes/authentication')(router);
var bodyParser = require('body-parser');
var cors = require('cors');
var blogs = require('./routes/blogs')(router);

mongoose.Promise = global.Promise;

mongoose.connect(config.uri,

  // {
  //   useMongoClient: true,

  // },
  function (err) {

    if (err) {

      console.log('Could not connect to database: ', err);
    } else {

      console.log('Connected to database: ' + config.db);
      //console.log(config.secret);

    }
  });

/*middleware = FROM
sending data from ang 4200 to api 8080 while in dev
remove cross-origin when deploying*/
app.use(cors({
  origin: 'http://192.168.13.33:4200'
}));

// parse application/x-www-form-urlencoded - place above express!
app.use(bodyParser.urlencoded({
  extended: false,
}));

// parse application/json - req.body.email, req.body.username, place above express!
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);
app.use('/blogs', blogs);
app.get('*', function (req, res) {res.sendFile(path.join(__dirname + '/client/dist/index.html'));});
app.listen(8080, function () {
  console.log('Listening on port 8080 and sending files to S.P.A. at ' + __dirname + '/client/dist/index.html');
});
