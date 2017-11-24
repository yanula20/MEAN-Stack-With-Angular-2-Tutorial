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
		   user.save( function (err){
            // Check if error occured
            if (err) {
              // Check if error is an error indicating duplicate account
              if (err.code === 11000) {
                res.json({ success: false, message: 'Username or e-mail already exists' }); // Return error
              } else {
                // Check if error is a validation rror
                if (err.errors) {
                  // Check if validation error is in the email field
                  if (err.errors.email) {
                    res.json({ success: false, message: err.errors.email.message }); // Return error
                  } else {
                    // Check if validation error is in the username field
                    if (err.errors.username) {
                      res.json({ success: false, message: err.errors.username.message }); // Return error
                    } else {
                      // Check if validation error is in the password field
                      if (err.errors.password) {
                        res.json({ success: false, message: err.errors.password.message }); // Return error
                      } else {
                        res.json({ success: false, message: err }); // Return any other error not already covered
                      }
                    }
                  }
                } else {
                  res.json({ success: false, message: 'Could not save user. Error: ', err }); // Return error if not related to validation
                }
              }
            } else {
              res.json({ success: true, message: 'Acount registered!' }); // Return success
            }
          });
        }
      }
    }
  });

  return router; // Return router object to main index.js
}