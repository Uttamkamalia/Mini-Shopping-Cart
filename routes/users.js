var express = require('express');
var router = express.Router();
var User=require('../models/user');
var StoreItems=require('../models/items');

var passport=require("passport");
var LocalStrategy=require("passport-local").Strategy;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/prac1');


var CurrentUser = "";


// Middleware function to redirect authentication

function ensureAuth(req,res,next){
	if(req.isAuthenticated()){
		console.log("Authenticated");
		return next();
	}
	console.log("index unauthenticaated")
	res.redirect('/users/login');
}

function ensureLog(req,res,next){
	if(req.isAuthenticated()){
		console.log("Already logged in")
		res.redirect('/users/home');
	}
	console.log("NOT logged in");
		return next();
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('main.ejs');
});



router.get('/login',ensureLog,function(req, res, next) {
  res.render('loginpage.ejs',{"title":"Login"});
});

router.get('/register', function(req, res, next) {
	res.render('registerpage.ejs',{"title":"Register"});
  });
  

router.get('/dashboard', function(req, res, next) {
	res.render('dashboard.ejs',{"title":"Login"});
  });

router.get('/home',ensureAuth,function(req,res){
	var itemsToDisp=[];
	StoreItems.find({}, function(err,storeitems){
		if(err){
			console.log("Error while fetching items:",err);
		}
		else{
			User.findOne({username:CurrentUser},function(err,data){
				if(err) {
					console.log("Error while showing cart:",err);
					throw err;
				}
				else{
					var useritems = data.items;
					
						var present = false;
						for(var i=0;i<useritems.length;i++)
						{
							
							if(item.name === useritems[i].name) {
								present = true;
							}
						}
						if(!present){
							itemsToDisp.push(item);
						}
					}
					});
					console.log("Welcome:",CurrentUser);
					res.render('home.ejs',{result:itemsToDisp,username:CurrentUser});
			}
			});

});



router.post('/register',function(req,res,next){
	console.log("registere::",req.body);
	var name=req.body.name;
	var email=req.body.email;
	var username=req.body.uname;
	var password=req.body.pword;
	var password2=req.body.cpword;

	
	req.checkBody('name','Name field is required').notEmpty();
	req.checkBody('uname','Username field is required').notEmpty();
	req.checkBody('email','Email field is required').notEmpty();
	req.checkBody('email','Email is not valid').isEmail(); 
	req.checkBody('pword','Password field is required').notEmpty();
	req.checkBody('cpword','Passwords do not match').equals(req.body.pword);

	var errors=req.validationErrors();

	if(errors){
		res.render('registerpage.ejs',{
			errors:errors,
			name:name,
			email:email,
			username:username,
			password:password,
			password2:password2,

		});
		console.log('register error:',errors);
	}
	else{
		var newUser=new User({
			name:name,
			email:email,
			username:username,
			password:password,
			
		});

		User.createUser(newUser,function(err,user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('succes','You are succesfully registered');
		res.location('/users/login');
		res.redirect('/users/login');
	}

});

passport.serializeUser(function(user,done){
	done(null,user.id);
});


passport.deserializeUser(function(id,done){
	User.getUserById(id,function(err,user){
		done(err,user);
	});
});

passport.use(new LocalStrategy(
		function(username,password,done){
			User.getUserByUsername(username,function(err,user){
				console.log("Authen username:",username);
				if(err) throw err;
				if(!user){
					console.log("Unknown User...");
					return done(null,false,{message:'Unknown User'});
				}

				User.comparePassword(password,user.password,function(err,isMatch){
					
					if(err){
						CurrentUser = "";
						throw err;
					}	
					if(isMatch){
				
						return done(null,user);
					}
					else{
						CurrentUser = "";
						console.log('Invalid Password');
						return done(null,false,{message:'Invalid Password'});
					}

				});

			});

		}
	));


router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid Username or password'}),function(req,res){

	console.log('Authentication Succesfull..');
	req.flash('succes','You are logged in..');
	CurrentUser = req.body.username;
	console.log("User logged In :",CurrentUser);
	res.redirect('/users/home');

});	


router.get('/logout',function(req,res){
	
	console.log("User logged Out :",CurrentUser);
	CurrentUser = "";
	req.logout();
	req.flash('succes','You are logged out!');
	res.redirect('/users/login');
});



router.post('/addtocart',function(req,res){

	var data = req.body;
	var username = data.username;
	var useritem = JSON.parse(data.userdata);
	


	User.findOne({username:username},function(err,data){
		if(err) console.log("Error while fetching data:",err);
		else{
			
			data.items.push(useritem);
			
			
			User.update({username:username},data,function(err,result){
				if(err) {
					console.log("Error while updating data...",err);
					throw err;
				}
				
				res.send("saved:"+useritem.name);
				
			});
		}

	});
	
});

router.get('/showcart',function(req,res,next){
	
	User.findOne({username:CurrentUser},function(err,data){
		if(err) {
			console.log("Error while showing cart:",err);
			throw err;
		}
		else{
			
			var totalprice = 0;
			data.items.forEach(function(item){
				totalprice += item.cost * item.quantity;
			});
			res.render('showcart.ejs',{username:CurrentUser,useritems:data.items,totalcost:totalprice});
		}
	});
});


router.get('/addItem',function(req,res,next){
	console.log("recieved query:",req.query);
	
	var itemname = req.query.itemname;
	var itemquan = 1;
	var sendUpdate = {};
	User.findOne({username:req.query.username},function(err,data){
		if(err) {
			console.log("Error while showing cart:",err);
			throw err;
		}
		else{
			var useritems = data.items;
			useritems.forEach(element => {
				if(element.name === itemname)
				{
					element.quantity = element.quantity +1;
					 itemquan = element.quantity;
				}
			
			});
			data.items = useritems;
			var totalprice = 0;
			useritems.forEach(function(item){
				totalprice += item.cost * item.quantity;
			});
			sendUpdate.total = totalprice;
			sendUpdate.itemquantity = itemquan;


			User.update({username:req.query.username},data,function(err,result){
				if(err) {
					console.log("Error while updating data...",err);
					throw err;
				}	
			});	
		}
		
		res.send(JSON.stringify(sendUpdate));
	});
});

router.get('/subItem',function(req,res,next){
	console.log("recieved query:",req.query);
	
	var itemname = req.query.itemname;
	var itemquan = 1;
	var sendUpdate = {};
	User.findOne({username:req.query.username},function(err,data){
		if(err) {
			console.log("Error while showing cart:",err);
			throw err;
		}
		else{
			var useritems = data.items;
			useritems.forEach(element => {
				if(element.name === itemname && element.quantity>1)
				{
					element.quantity = element.quantity-1;
					 itemquan = element.quantity;
				}
			
			});
			data.items = useritems;
			var totalprice = 0;
			useritems.forEach(function(item){
				totalprice += item.cost * item.quantity;
			});
			sendUpdate.total = totalprice;
			sendUpdate.itemquantity = itemquan;


			User.update({username:req.query.username},data,function(err,result){
				if(err) {
					console.log("Error while updating data...",err);
					throw err;
				}	
			});	
		}
		
		res.send(JSON.stringify(sendUpdate));
	});
});

router.get('/remItem',function(req,res,next){
	console.log("recieved query:",req.query);
	
	var itemname = req.query.itemname;
	var sendUpdate ={};
	
	User.findOne({username:req.query.username},function(err,data){
		if(err) {
			console.log("Error while showing cart:",err);
			throw err;
		}
		else{
			var useritems = [];
			data.items.forEach(element => {
				if(element.name !== itemname)
				{
					useritems.push(element);
				}
			
			});
			data.items = useritems;

			var totalcost = 0;
			useritems.forEach(function(item){
				totalcost += item.cost * item.quantity;
			});

			sendUpdate.itemname =itemname;
			sendUpdate.totalcost = totalcost;

			
			User.update({username:req.query.username},data,function(err,result){
				if(err) {
					console.log("Error while updating data...",err);
					throw err;
				}	
			});	
		}
		
		res.send(JSON.stringify(sendUpdate));
	});
});


module.exports = router;