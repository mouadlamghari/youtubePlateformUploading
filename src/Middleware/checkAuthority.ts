import { Request, Response } from "express";
import Editor from "../Models/Editor";
import mongoose, { ObjectId } from "mongoose";
import { ObjectId } from "mongodb";

export async function checkAuthority (req :Request ,res :Response ,next : CallableFunction){
        const user = req.user;
        const {account} = req.query
        const editor : any = await Editor.findById(user?._id)
        const has = editor?.Account.find(e=>e==account)
        if(has){
            return next()
        }
        return res.status(401).send({
            status:401,
            message:'user does not appear that has access to this account'
        })
}