import {
	Routes,
	Pages
}                      from './constants'
import {
	Document
} 										 from 'mongoose'
import { Router }      from 'express'
import { User }    from '../models'
import { Middleware }  from './../middlewares/index'

const router = Router();

router.get(Routes.AdminLogin, (req, res) => {

});

router.post(Routes.AdminLogin, (req, res) => {

})

router.get(Routes.AdminDashboard, Middleware.isAdmin, (req, res) => {
	res.render(Pages.AdminDashboard);
});

export default router