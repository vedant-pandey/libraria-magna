import * as mongoose              from 'mongoose'

import passportLocalMongoose = require('passport-local-mongoose')

const IssuanceSchema = new mongoose.Schema({
	userId		: mongoose.Schema.Types.ObjectId,
	bookId		: mongoose.Schema.Types.ObjectId,
	startTs		: Number,
	endTs			: Number,
	approved	: {
								type 		: Boolean,
								default : false
							},
	createTs	: {
								type 		: Number,
								default : Date.now()
							}
});

IssuanceSchema.plugin(passportLocalMongoose);

export const Issuance = mongoose.model('Issuance', IssuanceSchema as mongoose.PassportLocalSchema);