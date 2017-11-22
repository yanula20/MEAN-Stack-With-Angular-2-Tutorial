var User = require('../models/user');

module.exports = function (router){

router.post('/register', function(req, res){

		req.body.email;

		req.body.username;

		req.body.passoword;

	if (!req.body.email) {

		res.json({ success: false, message: "You must provide an e-mail!" });

	} else {
		console.log(req.body);
		res.send('hello world');
	}

	

});

	return router;
}