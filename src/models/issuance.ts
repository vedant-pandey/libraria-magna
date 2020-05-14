import * as mongoose              from 'mongoose'

import passportLocalMongoose = require('passport-local-mongoose')

const IssuanceSchema = new mongoose.Schema({
	userId		: mongoose.Schema.Types.ObjectId,
	bookId		: mongoose.Schema.Types.ObjectId,
	expiryTs	: Number,
	approved	: {
								type 		: Boolean,
								default : false
							},
	deleted		: {
								type 		: Boolean,
								default : false
							},
	createTs	: {
								type 		: Number,
								default : Date.now()
							}
});

IssuanceSchema.plugin(passportLocalMongoose);

export const Issuance = mongoose.model('Book', IssuanceSchema as mongoose.PassportLocalSchema);