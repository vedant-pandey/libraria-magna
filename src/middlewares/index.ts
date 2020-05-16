import { 
	Request, 
	Response, 
	NextFunction 
}                   from 'express'
import { Document } from 'mongoose'
import { User }     from '../models'

interface Middleware {
	isAdmin 	 : (req : Request, res : Response, next : NextFunction) => void,
	isLoggedIn : (req : Request, res : Response, next : NextFunction) => void
}

const isAdmin = (req : Request, res : Response, next : NextFunction) => {
	if (!req || !req.user) throw Error
	if(req.isAuthenticated()) {
		User.findById((req.user as Document)._id, (err, user) => {
			if (err || !user) {
				req.flash('error', 'User not found. Please login again.');
				return res.redirect('/login');
			}

			if (!user.schema.get('isAdmin')) {
				req.flash('error',`You don't have the necessary permission to do that.`)
				return res.redirect('back');
			}

			next();
		});
	} else {
		req.flash('error','You need to be logged in to do that');
		res.redirect('/login');
	}
}


const isLoggedIn = (req : Request, res : Response, next : NextFunction) => {
	if(req.isAuthenticated()){
		return next()
	}
	req.flash('error','You need to be logged in to do that.');
	res.redirect('/login');
}


export const Middleware : Middleware = {
	isAdmin,
	isLoggedIn
};