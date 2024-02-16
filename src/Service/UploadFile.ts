import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        const supportedExt = [
            ".MOV",
            ".MPEG-1",
            ".MPEG-2",
            ".MPEG4",
            ".MP4",
            ".MPG",
            ".AVI",
            ".WMV",
            ".MPEGPS",
            ".FLV",
            "3GPP",
            "WebM",
            "DNxHR",
            "ProRes",
            "CineForm",
            "HEVC (h265)"
        ]
        const extname = path.extname(file.originalname).toLowerCase()
        const filePath = (`${Date.now()}.${extname}`)
        if(supportedExt.find(e=>e.toLowerCase()==extname)){
            cb(null,filePath)
        }
        else{
            const err =  new Error()
            err.message=`the format of your video is not supported ${supportedExt.join(" -")} `
            cb(err,filePath)
        }
    }
})

export const upload = multer({storage})
