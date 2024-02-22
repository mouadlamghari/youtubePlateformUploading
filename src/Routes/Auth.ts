import express from "express"
import  AuthController  from "../Controllers/AuthController"
import chechAuth from "../Middleware/CheckAuth"
const router = express.Router()


router.get('/login',AuthController.login)
router.get('/user',chechAuth,AuthController.user)
router.get('/google/callback',AuthController.callback)
router.get('/refresh',AuthController.refresh)
export default router