import { Request, Response } from "express";
import Editor from "../Models/Editor";
import { ObjectId } from "mongodb";
import { EditorInterface } from "../Inrefaces/EditorInrerface";
import mongoose from "mongoose";

export async function checkAuthority (req :Request ,res :Response ,next : CallableFunction){
        const user = req.user as EditorInterface;
        const account = (req.params.id as unknown) as  mongoose.Types.ObjectId
        const editor : any = await Editor.findById(user?._id)
        const has = editor?.Account.find((e:mongoose.Types.ObjectId)=>e==account)
        console.log(has,editor,account)
        if(has){
            console.log(has)
            return next()
        }
        return res.status(401).send({
            status:401,
            message:'user does not appear that has access to this account'
        })
}