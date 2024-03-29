import mongoose, { Schema ,ObjectId,model, PopulatedDoc  } from "mongoose";

enum Actions{
    upload = 'upload',
    update = 'update', 
}

interface ActionInterface{
    editor : PopulatedDoc<Document>
    compte : PopulatedDoc<Document>
    approved : boolean
    reason : string
    action : string
}

const Action = new Schema <ActionInterface>({
    editor : {type:mongoose.Types.ObjectId,ref:"Editor"},
    compte:{type:mongoose.Types.ObjectId,ref:"User"},
    approved : {type:Boolean,default:null},
    reason : {type : String,default:""},
    action : {type : String , enum:Actions }
})

Action.virtual("uploads",{
    ref:"UploadAction",
    localField:"_id",
    foreignField:"action",
    justOne:true
})

Action.set("toJSON",{virtuals:true})
Action.set("toObject",{virtuals:true})

export default model("Action",Action)