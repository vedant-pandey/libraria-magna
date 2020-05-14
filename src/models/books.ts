import * as mongoose              from 'mongoose'

import passportLocalMongoose = require('passport-local-mongoose')

const BookSchema = new mongoose.Schema({
	isbn			: String,
	author		: String,
	title			: String,
	issuable	: Boolean,
	available	: Boolean
});

BookSchema.plugin(passportLocalMongoose);

export const Book = mongoose.model('Book', BookSchema as mongoose.PassportLocalSchema);
