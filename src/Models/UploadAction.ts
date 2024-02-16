import mongoose, { ObjectId, Schema, model  } from "mongoose";


enum status {
    s1 = "private",
    s2 = "public",
    s3 = "unlisted"
}

interface UploadInterface {
    action : ObjectId
    videoUrl : string
    title : string,
    description : string
    tags : string[]
    categoryId : number
    privacyStatus : status
    keywords : string
}
       
const UploadAction = new Schema  <UploadInterface> ({
    action : {type:mongoose.Types.ObjectId,ref:"Action"},
    videoUrl : {type:String,required:true},
    title : {type:String,required:true,minlength:1},
    description : {type:String,required:true,minlength:1},
    tags : [{type:String}],
    categoryId : {type:Number},
    privacyStatus:{type:String,default:status.s2},
    keywords:{type:String}
})

export default model <UploadInterface> ('UploadAction',UploadAction);
