import {
	Routes,
	Pages
}                      from './constants'
import {
	Document
} 										 from 'mongoose'
import { Router }      from 'express'
import { User }    		 from '../models'
import { Middleware }  from './../middlewares/index'
import passport 			 from 'passport'

const router 			 = Router(),
			ONE_MONTH_TS = 30 * 24 * 60 * 60 * 1000;

router.get(Routes.UserLogin, (req, res) => {
	res.render(Pages.UserLogin);
});

router.post(Routes.UserLogin, passport.authenticate('local', {
	successRedirect : Routes.GetAllBooks,
	failureRedirect : Routes.UserLogin,
	failureFlash 		: true
}), (req, res) => {});

router.get(Routes.UserRegister, (req, res) => {
	res.render(Pages.UserRegister);
});

router.post(Routes.UserRegister, (req, res) => {
	const newUser = new User({
		firstName             : req.body.firstName,
		lastName              : req.body.lastName,
		email                 : req.body.email,
		registerTs            : Date.now(),
		readingHoursAvailable : 150,
		membershipTs          : Date.now() + ONE_MONTH_TS,
		isAdmin               : false
	});

	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			req.flash('error', err.message);
			return res.redirect('back');
		}
		passport.authenticate('local')(req, res, () => {
			req.flash('success', `Welcome ${user.firstName} ${user.lastName}. You've successfully created your account.`);
			res.redirect(Routes.GetAllBooks);
		})
	})
});

router.get(Routes.GetAllUsers, Middleware.isLoggedIn, (req, res) => {
	User.find({isAdmin : false}, (err, users) => {
		if (err || !users.length) {
			req.flash('error', 'No users were found!');
			req.logout();
			return res.redirect(Routes.UserLogin);
		}
		res.render(Pages.GetUsers, {users : users});
	});
});

router.get(Routes.ViewUserDetail, Middleware.isLoggedIn, (req, res) => {
	if (!req.user) {
		req.flash('error', 'Session expired! Please login again');
		req.logout();
		return res.redirect(Routes.UserLogin);
	}
	
	User.findById((req.user as Document)._id, (err, user) => {
		if (err) {
			req.flash('error', 'No users were found!');
			req.logout();
			return res.redirect(Routes.UserLogin);
		}
		res.render(Pages.UserDetail, {user : user});
	});
});

router.get(Routes.EditUserDetail, Middleware.isLoggedIn, (req, res) => {
	if (!req.user) {
		req.flash('error', 'Session expired! Please login again');
		req.logout();
		return res.redirect(Routes.UserLogin);
	}

	if (req.params.id !== (req.user as Document)._id) {
		req.flash('error', 'You do not have the permission to do that!');
		return res.redirect(Routes.GetAllUsers);
	}
	
	User.findById(req.params.id, (err, user) => {
		if (err) {
			req.flash('error', 'No users were found!');
			req.logout();
			return res.redirect(Routes.UserLogin);
		}
		res.render(Pages.UserDetail, {user : user});
	});
});

router.post(Routes.EditUserDetail, Middleware.isLoggedIn, (req, res) => {
	const updatedUser = new User({
		firstName             : req.body.firstName,
		lastName              : req.body.lastName,
		email                 : req.body.email,
		registerTs            : Date.now(),
		readingHoursAvailable : 150,
		membershipTs          : Date.now() + ONE_MONTH_TS,
		isAdmin               : false
	});

	User.findByIdAndUpdate(req.params.id, {$set : updatedUser}, (err, user) => {
		if (err) {
			req.flash('error','Internal server error');
			return res.redirect(Routes.GetAllUsers);
		}
		req.flash('success', 'Your profile was updated.');
		res.redirect(`/users/${req.params.id}/`);
	});
});


export default router;