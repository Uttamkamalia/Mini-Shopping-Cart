var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressValidator=require("express-validator");
var session=require("express-session");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var bodyParser = require('body-parser');
var multer=require("multer");
var flash=require("connect-flash");
var mongo=require("mongodb");
var mongoose=require("mongoose");
//mongoose.connect('mongodb://localhost/prac1');

const options = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: 100, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  };

  /*
mongoose.connect('mongodb://uttam:temp@ds249249.mlab.com:49249/upvsales',options).then(
  ()=>{
    console.log("connected to mongoDB")},
 (err)=>{
     console.log("err",err);
});
*/


mongoose.connect('mongodb://uttam:temp@ds249249.mlab.com:49249/upvsales');


var db=mongoose.connection;
var port = process.env.PORT || 8080;


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//handle file uploads

app.use(multer({dest:'/uploads/'}).any());
//app.use(favicon(path.join(__dirname, 'public/icon/barn', 'favicon.ico')))


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//handle express session

app.use(session({

	secret:"secret",
	saveUninitialized:true,
	resave:true

}));
//passport

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
	errorFormatter:function(param,msg,value){

		var namespace=param.split(".")
		,root=namespace.shift()
		,formParam=root;

	

	while(namespace.length){

		formParam+='['+namespace.shift()+']';
	}
		return{
			param:formParam,
			msg:msg,
			value:value
		};
	}
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(flash());
app.use(function(req,res,next){
	res.locals.messages=require("express-messages")(req,res);
	next();
});

app.get('*',function(req,res,next){

	res.locals.user=req.user || null;
	next();

});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("404: Page not found");
});

app.listen(port,function()
{
	console.log("server started at port:",port);
});


module.exports = app;
