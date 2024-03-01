import express from "express"
import UploadContent from "../Controllers/UploadContent";
import { upload } from "../Service/UploadFile";
import { CheckType } from "../Middleware/checkType";
import chechAuth from "../Middleware/CheckAuth";
import { checkAuthority } from "../Middleware/checkAuthority";
const router = express.Router()


const uploadVideo = upload.single("video")


router.post('/upload/:id',
chechAuth,    
checkAuthority,
CheckType(uploadVideo),
UploadContent.upload);


router.post('/approve',
UploadContent.approve)




export default router