var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;


var titleLengthChecker = function (title) {
    if (!title) {
        return false; 
    } else {
    if (title.length < 5 || title.length > 50) {
        return false; 
    } else {
        return true;
    }
  }
};


var alphaNumbericChecker = function (title) {
    if (!title) {
        return false; 
    } else {
        var regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
        return regExp.test(title); 
    }
};

var titleValidators = [
  
  {
    validator: titleLengthChecker,
    message: 'Title must be at least 5 characters but no more than 50'
  },
  {
    validator: alphaNumbericChecker,
    message: 'Title must be alphanumeric.'
  }
];

var bodyLengthChecker = function(body){
    if(!body){
        return false;
    } else {
        if(body.length < 5 || body.length > 1000){
            return false
        } else{
            return true;
        }
    }
};


bodyValidators = [
   {
    validator: bodyLengthChecker,
    message: "The body must be between 5 and 1000 characters in length."
   }
];


var commentLengthChecker = function(comment){
    if(!comment[0]){
        return false;
    } else {
        if (comment[0].length < 1 || comment[0].length > 200){
            return false;
        } else {
            return true;
        }
    }

};


var commentValidators = [

 {
    validator: commentLengthChecker,
    message: 'Comments may not exceed 200 characters in length.'
 }

];

var blogSchema = new Schema({
    title: { 
        type: String, 
        required: true,
        validate: titleValidators
    },
    body: { 
        type: String, 
        required: true,
        validate: bodyValidators
    },
    createdBy: { 
        type: String, 
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now()
    },
    likes: { 
        type: Number, 
        default: 0
    },
    likedBy: { 
        type: Array
    },
    Dislikes: { 
        type: Number, 
        default: 0
    },
    DislikedBy: { 
        type: Array
    },
    comments: [{
        comment: { type: String, validate: commentValidators },
        commentator: { type: String }
    }]
});

module.exports = mongoose.model('Blog', blogSchema);

