import { 
	Routes, 
	Pages 
}                     from './constants'
import { 
	Book,
	Issuance
}       							from '../models'
import { Middleware } from './../middlewares/index'
import { Router }     from 'express'
import { Document } 	from 'mongoose'

const router = Router();

router.get(Routes.GetAllBooks, Middleware.isLoggedIn, (req, res) => {
	Book.find({}, (err, books) => {
		if (err) {
			req.flash('error', 'No books found!');
			return res.redirect(Routes.NotFound);
		}
		res.render(Pages.ViewAllBooks, {books : books});
	});
});

router.get(Routes.ViewIssuedBooks, Middleware.isLoggedIn, (req, res) => {
	const userId = (req.user as Document)._id;

	Issuance.find({ userId : userId }, (err, issuances : any[]) => {
		if (err) {
			req.flash('error','Internal server error');
			return res.redirect(Routes.NotFound);
		}

		if (!issuances.length) return res.render(Pages.ViewIssuedBooks, {books : []});

		const bookIds = issuances.map(issuance => issuance.bookId);

		Book.find({_id : {$in : bookIds}}, (err, books) => {
			if (err) {
				req.flash('error','Internal server error');
				return res.redirect(Routes.NotFound);
			}

			res.render(Pages.ViewIssuedBooks, {books : books});
		});
	});
});

router.get(Routes.CreateBook, Middleware.isAdmin, (req, res) => {
	res.render(Pages.CreateBook);
});

router.post(Routes.CreateBook, Middleware.isAdmin, (req, res) => {
	if (!req || !req.user) {
		return res.redirect(Routes.GetAllBooks);
	}

	const book = {
		title			: req.body.title,
		author		: req.body.author,
		isbn			: req.body.isbn,
		issuable	: req.body.issuable,
		available	: req.body.available
	}

	Book.create([book],(err,book) => {
		if(err){
			req.flash('error', 'Internal Server Error');
			return res.redirect(Routes.NotFound);
		}
		res.redirect(Routes.GetAllBooks);
	});
});

router.get(Routes.UpdateBook, Middleware.isAdmin, (req, res) => {
	res.render(Pages.UpdateBook);
});

router.post(Routes.UpdateBook, Middleware.isAdmin, (req, res) => {
	if (!req || !req.user) {
		return res.redirect(Routes.GetAllBooks);
	}

	const updatedBook = {
		title			: req.body.title,
		author		: req.body.author,
		isbn			: req.body.isbn,
		issuable	: req.body.issuable,
		available	: req.body.available
	}

	Book.findByIdAndUpdate(req.params.id, {$set : updatedBook}, (err,book) => {
		if(err){
			req.flash('error', 'Internal Server Error');
			return res.redirect(Routes.NotFound);
		}
		res.redirect(`/books/${req.params.id}`);
	});
});

router.get(Routes.DeleteBook, Middleware.isAdmin, (req, res) => {
	if (!req || !req.user) {
		return res.redirect(Routes.GetAllBooks);
	}

	Book.findByIdAndDelete(req.params.id, (err, book) => {
		if(err){
			req.flash('error', 'Internal Server Error');
			return res.redirect(Routes.NotFound);
		}
		res.redirect(Routes.GetAllBooks);
	});
});

router.get(Routes.GetBook, Middleware.isLoggedIn, (req, res) => {
	if (!req || !req.user) {
		return res.redirect(Routes.GetAllBooks);
	}

	Book.findById(req.params.id, (err, book) => {
		if(err){
			req.flash('error', 'Internal Server Error');
			return res.redirect(Routes.NotFound);
		}
		res.render(Pages.BookDetail, {book : book});
	});
});

router.post(Routes.ChangeAvailability, Middleware.isAdmin, (req, res) => {
	if (!req || !req.user) {
		return res.redirect(Routes.GetAllBooks);
	}

	Book.findByIdAndUpdate(req.params.id, {$set : {available : req.body.available}}, (err, book) => {
		if(err){
			req.flash('error', 'Internal Server Error');
			return res.redirect(Routes.NotFound);
		}
		res.redirect(`/books/${req.params.id}`);
	});
});

router.post(Routes.ChangeIssuability, Middleware.isAdmin, (req, res) => {
	if (!req || !req.user) {
		return res.redirect(Routes.GetAllBooks);
	}

	Book.findByIdAndUpdate(req.params.id, {$set : {issuable : req.body.issuable}}, (err, book) => {
		if(err){
			req.flash('error', 'Internal Server Error');
			return res.redirect(Routes.NotFound);
		}
		res.redirect(`/books/${req.params.id}`);
	});
});

export default router;