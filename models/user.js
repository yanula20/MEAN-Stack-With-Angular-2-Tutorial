var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
SALT_WORK_FACTOR = 10;

var emailLengthChecker = function (email){
    if (!email){
        return false;
    } else {
        if (email.length < 5 || email.length > 30){
        return false;
    } else {
      return true;
    }
  }
};


var emailValidators = [{
  validator: emailLengthChecker, message: 'Email must be at least 5 characters, but no more than 30.'
}];

var userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }
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
userSchema.methods.comparePassword = function(password, cb){
    bcrypt.compare(password, this.password, function(err, isMatch) {

        if(err) return (err);
        cb(null, isMatch);
    });// Return comparison of login password to password in database (true or false)
};

module.exports = mongoose.model('User', userSchema);



