import { ObjectId } from "mongodb";
import mongoose, { Schema,model, PopulatedDoc } from "mongoose";
import { EditorInterface } from "../Inrefaces/EditorInrerface";


const Editor =new Schema <EditorInterface> ({
    username : {type:String,required:true,unique:true},
    password :{type:String,required:true},
    email :{type:String,unique:true,required:true},
    name :{type:String,required:true},
    lastname :{type:String,required:true},
    Account : [{type:mongoose.Types.ObjectId,ref:"User"}]
},{timestamps:true})

Editor.virtual("actions",{
    ref:"Action",
    localField:"_id",
    foreignField:"editor",
    justOne:false
})


Editor.virtual("invitations",{
    ref:"Invitation",
    localField:"_id",
    foreignField:"EditorId",
    justOne:false
})



Editor.set('toObject',{virtuals:true})
Editor.set('toJSON',{virtuals:true})


export default model <EditorInterface>('Editor',Editor)
