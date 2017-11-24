var User = require('../models/user');

module.exports = function (router){

router.post('/register', function (req, res){

	if (!req.body.email) {

	   res.json({ success: false, message: "You must provide an e-mail!" });

	} else {

	  if (!req.body.username) {

	  	 res.json({ success: false, message: "You must provide an username!" });

	  } else {

		if (!req.body.password){

		   res.json({ success: false, message: "You must provide an password!" });

		} else {

		  var user = new User({

		  	email: req.body.email.toLowerCase(),

		  	username: req.body.username.toLowerCase(),

		  	password: req.body.password

		  });

		  user.save(function(err) {

		  	if (err){

		  		if (err.code === 11000){

		  			res.json({success: false, message: 'Username or e-mail already exists!'});

		  		} else {

		  			res.json({ success: false, message: "Could not save user. Error: ", err});
		  		}   

		  	} else {

		  	  	 res.json({ success: true, message: "User Saved!"});

		  	  	 console.log(user.username + ' ' + user.email + ' ' + user.password);
		  	  }

		  });
		}
	  }
	}
});

	return router; // Return router object to main index.js
}