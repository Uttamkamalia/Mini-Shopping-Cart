var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',ensureAuth,function(req, res, next) {
	res.redirect('/users/home');
  //res.render('home.ejs', { title: 'Members' });
});


function ensureAuth(req,res,next){
	if(req.isAuthenticated()){
		console.log("Authenticated");
		return next();
	}
	console.log("index unauthenticaated")
	res.redirect('/users/login');
}


module.exports = router;