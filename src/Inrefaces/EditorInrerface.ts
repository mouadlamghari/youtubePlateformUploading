import { ObjectId } from "mongodb";

export interface EditorInterface{
    _id : ObjectId
    username:string,
    password?:string,
    name ?: string,
    lastname?:string,
    email:string,
    Account:ObjectId[]
    invitations : []
}