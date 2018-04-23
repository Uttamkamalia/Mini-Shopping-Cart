var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');
//mongoose.connect('mongodb://localhost/prac1');
//mongoose.connect('mongodb://uttam:temp@ds249249.mlab.com:49249/upvsales');
var db=mongoose.connection;

var UserSchema=mongoose.Schema({
	name:{
		type:String,
		index:true
	},
	cost:{
		type:Number
	},
	quantity:{
		type:Number
	}	
});

var StoreItems=module.exports=mongoose.model('storeitems',UserSchema);

module.exports.disp = function()
{
   StoreItems.find({}).exec(function(err,data){
	console.log("usuaal data:",data);
   });
};