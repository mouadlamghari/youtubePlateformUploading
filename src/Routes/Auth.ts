import express from "express"
import  AuthController  from "../Controllers/AuthController"
const router = express.Router()


router.get('/login',AuthController.login)
router.get('/google/callback',AuthController.callback)
router.get('/refresh',AuthController.refresh)
export default router