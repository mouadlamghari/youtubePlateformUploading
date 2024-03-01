import express from "express"
import Editors from "../Controllers/ContentEditors"
import chechAuth from "../Middleware/CheckAuth"
import { EditorController } from "../Controllers/editorController"
const router = express.Router()


router.route('/auth')
.post(Editors.editor)
router.route('/login')
.post(Editors.login)
router.post('/invite',Editors.invite)
router.post('/accept/:invitationId',chechAuth,Editors.accept)
router.post('/refuse/:invitationId',chechAuth,Editors.refuse)
router.get('/Actions',chechAuth,EditorController.getActions)
router.get('/Accounts',chechAuth,EditorController.getAccounts)
router.get('/Invitations',chechAuth,EditorController.getInvitation)

export default router;
