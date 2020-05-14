import * as mongoose              from 'mongoose'

import passportLocalMongoose = require('passport-local-mongoose')

const ONE_MONTH_TS = 30 * 24 * 60 * 60 * 1000;

const UserSchema = new mongoose.Schema({
	firstName  						: String,
	lastName   						: String,
	password   						: String,
	isAdmin    						: String,
	email      						: {
														type 	 : String,
														unique : true
													},
	registerTs 						: {
															type		: Number, 
															default	: Date.now()
													},
	readingHoursAvailable : {
														type		: Number,
														default	: 150
													},
	membershipTs 					: {
														type		: Number,
														default	: Date.now() + ONE_MONTH_TS
													}
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

export const User = mongoose.model('User', UserSchema as mongoose.PassportLocalSchema);