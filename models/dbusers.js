var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
//mongoose.connect('mongodb://localhost/prac1');
//mongoose.connect('mongodb://uttam:temp@ds249249.mlab.com:49249/upvsales');
var db = mongoose.connection;

var userSchema = mongoose.Schema({
    username:{
        type:String,
        index:true
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    name:{
        type:String
    },
    profileimage:{
        type:String
    }
});

var User = module.exports = mongoose.model('loginUsers',userSchema);

module.exports.getUserById = function(Id,callback){
    User.findById(Id,callback);
}

module.exports.getUserByUsername = function(username,callback){
    var query = {username:username};
    User.findOne(query);
}

module.exports.comparePassword = function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword,hash,function(err,isMatch){
        callback(null,isMatch);

    });

};

module.exports.createUser = function(newuser,callback){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newuser.password,salt,function(err,hash){
            newuser.password = hash;
            newuser.save(callback);
        });
    });
    
};