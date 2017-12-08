var User = require('../models/user');
var Blog = require('../models/blog');
var jwt = require('jsonwebtoken');
var config = require('../config/database');

module.exports = function (router){

router.post('/newBlog', function (req, res){
	if (!req.body.title) {
		res.json({success: false, message: "Blog title is required."});
	} else {
		if (!req.body.body) {
			res.json({success: false, message: "Blog body is required."});
	    } else {
			if (!req.body.createdBy) {
				res.json({success: false, message: "CreatedBy is required."});
		     } else {
				var blog = new Blog ({
					title: req.body.title,
					body: req.body.body,
					createdBy: req.body.createdBy
				});
				blog.save(function (err) {
					// Check if error
            		if (err) {
              			// Check if error is a validation error
              			if (err.errors) {
                			// Check if validation error is in the title field
                			if (err.errors.title) {
                  				res.json({ success: false, message: err.errors.title.message }); // Return error message
                			} else {
                  				// Check if validation error is in the body field
                  				if (err.errors.body) {
                    				res.json({ success: false, message: err.errors.body.message }); // Return error message
                  				} else {
                    				res.json({ success: false, message: err }); // Return general error message
                  				  }
                			  }
              			} else {
                			res.json({ success: false, message: err }); // Return general error message
              		      }
           	 	    } else {
              			res.json({ success: true, message: 'Blog saved!' }); // Return success message
            	      }
			    });
		     } //17
	      }//14
	  }//11
});//router.post
// -1, descending order
router.get('/allBlogs', function (req,res) {

  Blog.find({}, function(err, blogs) {
  	if (err) {
  		res.json({ success: false, message: err});
  	} else {
  		if (!blogs) {
  			res.json({ success: false, message: "No blogs found."});
  		} else {
  			res.json({ success: true, blogs: blogs});
  		  }
  	  }
  }).sort({'_id': -1});
});

return router;

};//module.exports


