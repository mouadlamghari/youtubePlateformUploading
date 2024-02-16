import express from "express"
import Editors from "../Controllers/ContentEditors"
import chechAuth from "../Middleware/CheckAuth"
const router = express.Router()


router.route('/auth')
.post(Editors.editor)
router.route('/login')
.post(Editors.login)
router.post('/invite',Editors.invite)
router.post('/accept/:invitationId',chechAuth,Editors.accept)
export default router;