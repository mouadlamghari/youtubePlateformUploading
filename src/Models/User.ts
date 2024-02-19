import mongoose from "mongoose";

const Schema = mongoose.Schema

interface UserInerface {
    _id : mongoose.Types.ObjectId
    name : string,
    lastName:string,
    picture:string,
    email : string,
    tokens:Object 
}

const User = new Schema <UserInerface> ({
    name : {type:String,required:true},
    lastName : {type:String,required:true},
    picture  : {type:String},
    email  :{type:String},
    tokens:{type:Object}
},{timestamps:true})

export default mongoose.model<UserInerface>('User',User)