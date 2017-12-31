var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/database');

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
                // Check if error is a validation error in user model
                if (err.errors) {
                  // Check if validation error is in the email field
                  if (err.errors.email) {
                    res.json({ success: false, message: err.errors.email.message }); // Return error
                  } else {
                    // Check if validation error is in the username field in user model
                    if (err.errors.username) {
                      res.json({ success: false, message: err.errors.username.message }); // Return error
                    } else {
                      // Check if validation error is in the password field in user model
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
              res.json({ success: true, message: 'Account registered!' }); // Return success
            }
          });
        }
      }
    }
  });
 

  /* ============================================================
     Route to check if user's email is available for registration
  ============================================================ */
  router.get('/checkEmail/:email', (req, res) => {
    // Check if email was provided in paramaters
    if (!req.params.email) {
      res.json({ success: false, message: 'E-mail was not provided' }); // Return error
    } else {
      // Search for user's e-mail in database;
      User.findOne({ email: req.params.email }, (err, user) => {
        if (err) {
          res.json({ success: false, message: err }); // Return connection error
        } else {
          // Check if user's e-mail is taken
          if (user) {
            res.json({ success: false, message: 'E-mail is already taken' }); // Return as taken e-mail
          } else {
            res.json({ success: true, message: 'E-mail is available' }); // Return as available e-mail
          }
        }
      });
    }
  });

  /* ===============================================================
     Route to check if user's username is available for registration
  =============================================================== */
  router.get('/checkUsername/:username', (req, res) => {
    // Check if username was provided in paramaters
    if (!req.params.username) {
      res.json({ success: false, message: 'Username was not provided' }); // Return error
    } else {
      // Look for username in database
      User.findOne({ username: req.params.username }, (err, user) => {
        // Check if connection error was found
        if (err) {
          res.json({ success: false, message: err }); // Return connection error
        } else {
          // Check if user's username was found
          if (user) {
            res.json({ success: false, message: 'Username is already taken' }); // Return as taken username
          } else {
            res.json({ success: true, message: 'Username is available' }); // Return as vailable username
          }
        }
      });
    }
  });


router.post('/login', (req, res) => {
    if (!req.body.username){
      res.json({success: false, message: "No username was provided." });
    } else {
      if (!req.body.password) {
        res.json({success: false, message: "No password was provided." });
      } else {
        User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
          if (err) {
            res.json({ success: false, message: err });
          } else {
            if (!user) {
              res.json({ success: false, message: "Username not found." });
            } else { //username was found, now we must compare stored and entered passwords
              var validPassword = user.comparePassword(req.body.password);
              if (!validPassword) {//failed password comparison test
                res.json({ success: false, message: "Passwords do not match." });
              } else {
                var token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h'});
                res.json({ success: true, message: "Success!", token: token, user: {username: user.username } });
              }
            }
          }
        });
      }
    }  
});


/*middleware uses '.use'
grab token from the header
routes that require authorization tokens must go below this middleware
routes that don't require authorization can go above this middleware */

router.use((req, res, next) => {
  var token = req.headers['authorization'];
  if (!token) {
    res.json({ success: false, message: "No token provided." });
  } else {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.json({ success: false, message: "Token invalid: " + err });
      } else {
        req.decoded = decoded; 
        next();
      }
    });
  }
});



router.get('/profile', (req, res) => {
  /*res.send(req.decoded);*/
  /*res.send('test');*/
  User.findOne({_id: req.decoded.userId }).select('username email').exec((err, user) => {
    if (err) {
      res.json({ success: false, message: err });
    } else {
      if (!user) {
        res.json({ success: false, message: "User not found." });
      } else {
        res.json({ success: true, user: user });
      }
    }
  });
});

router.get('/publicProfile/:username', (req, res) => {
  if (!req.params.username) {
    res.json({success: false, message: 'No username was provided.'});
  } else {
     User.findOne({username: req.params.username}).select('username email').exec((err, user) => {
      if (err) {
        res.json({success: false, message: 'Something went wrong!'});
      } else {
        if (!user) {
          res.json({success: false, message: 'Username not found.'});
        } else {
          res.json({success: true, user: user});
        }
      }
    });
  }
});



  return router; // Return router object to main index.js
}





