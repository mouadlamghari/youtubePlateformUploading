import mongoose from "mongoose";

export interface InvitationInterface {
    compteId : mongoose.Types.ObjectId
    EditorId : mongoose.Types.ObjectId,
    visited : Boolean,
    accepted : string
}