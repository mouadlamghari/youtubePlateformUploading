import mongoose,{ Schema,model,ObjectId } from "mongoose";

import {InvitationInterface} from "../Inrefaces/InvitationInterface"


enum comfirm {
    accept = "confirm",
    refuse = "refuse"
}


const Invitation = new Schema  ({
    compteId : {type : mongoose.Types.ObjectId,ref:"User"},
    EditorId : {type : mongoose.Types.ObjectId,ref:"Editor"},
    visited : {type:Boolean,default:false},
    accepted : {type:String,enum:comfirm}
})

export default model <InvitationInterface> ('Invitation',Invitation)