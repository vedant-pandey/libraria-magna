import {
	Routes,
	Pages
}                      from './constants'
import {
	Document
} 										 from 'mongoose'
import { 
	Issuance, 
	User
}                      from '../models'
import { Router }      from 'express'
import { Middleware }  from './../middlewares/index'

const router = Router();

// get for current user
// router.get(Routes.Base, Middleware.isLoggedIn, (req, res) => {
// 	Issuance.find({userId : (req.user as Document)._id}, (err, issuances) => {
// 		if (err) {
// 			console.log('An error occured in the DB');
// 			console.log(err);
// 			req.flash('error', 'Internal Server Error');
// 			return res.redirect(Routes.Base)
// 		}
// 		res.render(Pages.IssuancesHome, {issuances : issuances});
// 	});
// });

// // create for current user
// router.post(Routes.ParamId, Middleware.isLoggedIn, (req, res) => {
// 	if (!req || !req.user) {
// 		return res.redirect(Routes.Base);
// 	}

// 	const issuance = {
// 		userId   : (req.user as Document)._id,
// 		bookId   : req.params.id,
// 		expiryTs : req.body.expiry,
// 		approved : false,
// 		deleted  : false,
// 		createTs : Date.now()
// 	}

// 	Issuance.create([issuance], (err, issuance) => {
// 		if(err){
// 			console.log('DB could not add new book');
// 			console.log(err);
// 			req.flash('error', 'Internal Server Error');
// 			return res.redirect(Routes.Base);
// 		}
// 		res.redirect(Routes.Books);
// 	})
// })

// // get for approval
// router.get(Routes.ApprovalList, Middleware.isAdmin, (req, res) => {
// 	if (!req || !req.user) {
// 		return res.redirect(Routes.Base);
// 	}

// 	Issuance.find({approved : false}, (err, issuances) => {
// 		if (err) {
// 			console.log('An error occured in the DB');
// 			console.log(err);
// 			req.flash('error', 'Internal Server Error');
// 			return res.redirect(Routes.Base);
// 		}
// 		res.render(Pages.IssuancesUnapproved, {issuances : issuances});
// 	});
// });

// // approve issuance
// router.get(Routes.ApproveIssuance, Middleware.isAdmin, (req, res) => {
// 	if (!req || !req.user) {
// 		return res.redirect(Routes.Base);
// 	}

// 	Issuance.findByIdAndUpdate(req.params.id, {$set : {approved : true}}, (err, issuance) => {
// 		if (err || !issuance) {
// 			req.flash('error','Sorry, the requested book does not exist in this library');
// 			return res.redirect(Routes.NotFound);
// 		}
// 		req.flash(`success`,`You approved the request for issue.`);
// 		res.redirect(Routes.ApprovalList);
// 	});
// });

// // get for current user
// router.get(Routes.ShowUserIssuance, Middleware.isLoggedIn, (req, res) => {
// 	if (!req || !req.user) {
// 		return res.redirect(Routes.Base);
// 	}

// 	Issuance.find({userId : (req.user as Document)._id}, (err, issuances) => {
// 		if (err) {
// 			console.log('An error occured in the DB');
// 			console.log(err);
// 			req.flash('error', 'Internal Server Error');
// 			return res.redirect(Routes.Base);
// 		}
// 		res.render(Pages.IssuanceHistory, {issuances : issuances});
// 	});
// })

// // remove for current user
// router.get(Routes.DeleteIssuance, Middleware.isLoggedIn, (req, res) => {
// 	if (!req || !req.user) {
// 		return res.redirect(Routes.Base);
// 	}

// 	Issuance.findOneAndUpdate(
// 		{_id : req.params.id, userId : (req.user as Document)._id},
// 		{$set : {deleted : true}},
// 		(err, issuance) => {
// 			if (err || !issuance) {
// 				req.flash('error','Sorry, the requested book does not exist in this library');
// 				return res.redirect(Routes.NotFound);
// 			}
// 			req.flash(`success`,`You approved the request for issue.`);
// 			res.redirect(Routes.ApprovalList);
// 		}
// 	);
// });

router.get(Routes.DeleteIssuance, Middleware.isLoggedIn, (req, res) => {
	if (!req || !req.user) {
		return res.redirect(Routes.GetAllBooks);
	}

	Issuance.findByIdAndDelete(req.params.id, (err, book) => {
		if(err){
			req.flash('error', 'Internal Server Error');
			return res.redirect(Routes.NotFound);
		}
		res.redirect(Routes.ViewIssuedBooks);
	});
});

router.post(Routes.IssueForRead, Middleware.isLoggedIn, (req, res) => {
	if (!req || !req.user) {
		return res.redirect(Routes.GetAllBooks);
	}

	const startTime = new Date(req.body.startTs),
				endTime		= new Date(req.body.endTs);

	if (req.body.endTs <= req.body.startTs) {
		req.flash('error', 'End time should be later than start time.');
		return res.redirect(Routes.GetAllBooks);
	}

	if (startTime.getHours() >= 17 ||
			startTime.getHours() < 10 ||
			endTime.getHours() >= 17) {

		req.flash('error', 'Invalid end time');
		return res.redirect(Routes.GetAllBooks);
	}

	const duration = endTime.getHours() - endTime.getHours();

	User.findById((req.user as Document)._id, (err, user : any) => {
		if (user.readingHoursAvailable < duration) {
			req.flash('error', `You don't have enough available reading hours`);
			return res.redirect(Routes.GetAllBooks);
		}
		const newAvailable = user.readingHoursAvailable - duration
		User.findByIdAndUpdate((req.user as Document)._id, {$set : {readingHoursAvailable : newAvailable}});
	});

	const issuance = {
		userId		: (req.user as Document)._id,
		bookId		: req.params.id,
		startTs		: startTime.getTime(),
		expiryTs	: endTime.getTime(),
		approved	: false
	}

	Issuance.create([issuance], (err, issuance) => {
		if(err){
			req.flash('error', 'Internal Server Error');
			return res.redirect(Routes.NotFound);
		}
		res.redirect(Routes.GetAllBooks);
	});
});

router.post(Routes.IssueForBorrow, Middleware.isLoggedIn, (req, res) => {
	if (!req || !req.user) {
		return res.redirect(Routes.GetAllBooks);
	}

	const startTime = new Date(req.body.startTs),
				endTime		= new Date(req.body.endTs);

	if (req.body.endTs <= req.body.startTs) {
		req.flash('error', 'End time should be later than start time.');
		return res.redirect(Routes.GetAllBooks);
	}

	if (startTime.getHours() >= 17 ||
			startTime.getHours() < 10 ||
			endTime.getHours() >= 17) {

		req.flash('error', 'Invalid end time');
		return res.redirect(Routes.GetAllBooks);
	}

	const duration = endTime.getHours() - endTime.getHours();

	User.findById((req.user as Document)._id, (err, user : any) => {
		if (user.readingHoursAvailable < duration) {
			req.flash('error', `You don't have enough available reading hours`);
			return res.redirect(Routes.GetAllBooks);
		}
		const newAvailable = user.readingHoursAvailable - duration
		User.findByIdAndUpdate((req.user as Document)._id, {$set : {readingHoursAvailable : newAvailable}});
	});

	const issuance = {
		userId		: (req.user as Document)._id,
		bookId		: req.params.id,
		startTs		: startTime.getTime(),
		expiryTs	: endTime.getTime(),
		approved	: false
	}

	Issuance.create([issuance], (err, issuance) => {
		if(err){
			req.flash('error', 'Internal Server Error');
			return res.redirect(Routes.NotFound);
		}
		res.redirect(Routes.GetAllBooks);
	});
});

router.post(Routes.AcceptIssueRequest, Middleware.isAdmin, (req, res) => {});

router.get(Routes.ViewAllIssuance, Middleware.isAdmin, (req, res) => {});


export default router;