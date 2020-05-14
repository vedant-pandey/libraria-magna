	//=========//
 // Imports //
//=========//

import express							 = require('express');
import dotenv								 = require('dotenv');
import mongoose							 = require('mongoose');
import bodyParser						 = require('body-parser');
import passport							 = require('passport');
import LocalStrategy				 = require('passport-local');
import passportLocalMongoose = require('passport-local-mongoose');
import expressSanitizer			 = require('express-sanitizer');
import flash								 = require('connect-flash');
import session							 = require('express-session');
import methodOverride 			 = require('method-override');
import path 								 = require('path');

	//================//
 // Initialisation //
//================//

dotenv.config()
const app   		 : express.Application = express(),
			PORT  		 : string							 = process.env.PORT || '7263',
			DBURL 		 : string							 = process.env.DBURL || 'mongodb://localhost/library',
			APP_SECRET : string							 = process.env.APP_SECRET || 'SECRET',
			PARENT_DIR : string							 = __dirname.split(path.delimiter)
																									.slice(0,__dirname.split(path.delimiter).length - 1)
																									.join(path.delimiter)
  //=============//
 // Connections //
//=============//

mongoose.connect(DBURL, {
	useNewUrlParser  : true,
	useCreateIndex   : true,
	useFindAndModify : false
});

app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static(path.join(PARENT_DIR, '/public')));
app.set('view engine', 'ejs');
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(flash());

  //=================//
 // Passport Config //
//=================//

app.use(session({
	secret            : APP_SECRET,
	resave            : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.user = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

  //==========//
 // Listener //
//==========//

app.listen(PORT, function(){
	console.log(`Server running ${PORT}\n`);
});
process.on('SIGINT',function(){
	console.log('Closing server');
	process.exit();
});
