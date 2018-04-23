var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');
//mongoose.connect('mongodb://localhost/prac1');
//mongoose.connect('mongodb://uttam:temp@ds249249.mlab.com:49249/upvsales');
var db=mongoose.connection;

var UserSchema=mongoose.Schema({
	username:{
		type:String,
		index:true
	},
	password:{
		type:String ,required:true ,bcrypt:true
	},
	name:{
		type:String
	},
	email:{
		type:String
	},
	items: { type : Array , "default" : [] } 
	
});

var User=module.exports=mongoose.model('Users',UserSchema);

module.exports.disp = function()
{
   User.find({}).exec(function(err,data){
	console.log("usuaal data:",data);
   });
};

module.exports.getAuth = function(username,password){

		var routeInfo = {
			rou:"/users/login"
		};

	User.findOne({username:username}).exec(function(err,data){
		if(err){
			console.log("error fetching:",err);
		}
		else{
			if(data.username === username){
				console.log("username verified");
				bcrypt.compare(password,data.password,function(err,isMatch){
					if(err){
						console.log("pass not verified,",err);
					}
					else if(isMatch){
						console.log("password verified:,",password);
						routeInfo.rou = "/users/dashboard";
						
					}

				});

			
			}
			else{
				console.log("username not verified");
			}
		}

	});
	console.log("roteInfo:",routeInfo);
	return routeInfo;
};



module.exports.comparePassword=function(candidatePassword,hash,callback){

	bcrypt.compare(candidatePassword,hash,function(err,isMatch){
		if(err) return callback(err);
		callback(null,isMatch);

	});

}

module.exports.getUserById=function(id,callback){
	User.findById(id,callback);
}

module.exports.getUserByUsername=function(username,callback){

	var query={username,username};
	User.findOne(query,callback);
}


module.exports.createUser=function(newUser,callback){

	bcrypt.hash(newUser.password,10,function(err,hash){
		if(err) throw err;
		newUser.password=hash;
		newUser.save(callback);
	});	
}