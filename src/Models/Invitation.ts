import mongoose,{ Schema,model,ObjectId } from "mongoose";


interface InvitationInterface {
    compteId : ObjectId
    EditorId : ObjectId,
    visited : Boolean,
    accepted : string
}

enum comfirm {
    accept = "confirm",
    refuse = "refuse"
}


const Invitation = new Schema <InvitationInterface> ({
    compteId : {type : mongoose.Types.ObjectId,ref:"User"},
    EditorId : {type : mongoose.Types.ObjectId,ref:"Editor"},
    visited : {type:Boolean,default:false},
    accepted : {type:String,enum:comfirm}
})

export default model('Invitation',Invitation)