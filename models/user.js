var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
SALT_WORK_FACTOR = 10;


var emailLengthChecker = function (email) {
    // Check if e-mail exists
    if (!email) {
        return false; // Return error
    } else {
    // Check the length of e-mail string
    if (email.length < 5 || email.length > 30) {
        return false; // Return error if not within proper length
    } else {
        return true; // Return as valid e-mail
    }
  }
};

// Validate Function to check if valid e-mail format
var validEmailChecker = function (email) {
    // Check if e-mail exists
    if (!email) {
        return false; // Return error
    } else {
    // Regular expression to test for a valid e-mail
        var regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email); // Return regular expression test results (true or false)
    }
};

// Array of Email Validators
var emailValidators = [
  // First Email Validator
  {
    validator: emailLengthChecker,
    message: 'E-mail must be at least 5 characters but no more than 30'
  },
  // Second Email Validator
  {
    validator: validEmailChecker,
    message: 'Must be a valid e-mail'
  }
];

var usernameLengthChecker = function(username){
    if(!username){
        return false;
    } else {
        if(username.length < 5 || username.length > 15){
            return false
        } else{
            return true;
        }
    }
};

var validUsername = function(username){
    if(!username){
        return false;
    } else{
        regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
};

usernameValidators = [
   {
    validator: usernameLengthChecker,
    message: "Username must be between 5 and 15 characters in length."
   },
   {
    validator: validUsername,
    message: "Username must not have any special characters."
   }
];


var passwordLengthChecker = function(password){
    if(!password){
        return false;
    } else {
        if (password.length < 8 || password.length > 35){
            return false;
        } else {
            return true;
        }
    }

};

var validPaassword = function(password){
    if(!password){
        return false;
    } else {
        var regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password);
    } 
}

var passwordValidators = [

 {
    validator: passwordLengthChecker,
    message: 'Your password must be between 8 and 35 characters in length.'
 },
 {
    validator: validPaassword,
    message: 'Your password must have at least one uppercase, lowercase, special character, and number.'
 }

];

var userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
    username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
    password: { type: String, required: true, validate: passwordValidators}
});



// Schema Middleware to Encrypt Password
userSchema.pre('save', function(next){
    var user = this;
    // Ensure password is new or modified before applying encryption
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if (err) return next(err);

         // Apply encryption
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if (err) return next(err); // Ensure no errors
            user.password = hash; // Apply encryption to password
            next(); // Exit middleware
        });
    });
});

 

// Methods to compare password to encrypted password upon login
userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);



