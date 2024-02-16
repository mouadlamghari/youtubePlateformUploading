import fs from "fs";
import Editor from "../Models/Editor";
import { Mail } from "../Service/Mail";
import { ApiError } from "../Utils/ApiError";
import  JWT from "jsonwebtoken" 
import { Response,Request } from "express";
import path from "path"; 
import crypto from "crypto"
import bcrypt from "bcrypt"
import { validator } from "../Utils/Validator";
import Invitation from "../Models/Invitation";
import { abort } from "process";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import Editor from "../Models/Editor";
import { generateAccess } from "../Utils/GenerateTokenAccess";

export default class Editors{
    /*
    create an editor
     */
    static async editor(req :Request ,res:Response) {
        try{
           //console.log( await Editor.listIndexes().then(res=>console.log(res)))
           // methode to get to get indexes

            //data validation
            await validator({body:req.body,
                rules:{"username":"required|min:4","password":'required|min:8','name':'required','lastname':'required'},
               customessage:{"username.required":"user is required"},
               callback:async (err:any,status:any)=>{
                    if(!status){
                        // send error message
                       return  res.status(412).send({
                                    status:412,
                                    message:"Validation failed",
                                    data:err
                        })
                    }
                    else{
                        let {username,password,email,name,lastname}=req.body;
                       
                        // salt the password
                        let salt = await bcrypt.genSalt(10)
                        password =await bcrypt.hash(password,salt)
                        /// create editor
                        const newEditor = await Editor.create({email,username,password,name,lastname});
                        // token payload
                        let payload = {_id:newEditor.id,username,email}
                         // get privat  access token  
                         let pathToAccess : string = path.resolve("secrets_private.pem")
                         let privateA : string =   fs.readFileSync(pathToAccess,"utf-8")
                         // get private refresh token 
                         let pathToefresh  : string = path.resolve("secrect_private_refresh.pem")
                         let privateR : string =   fs.readFileSync(pathToefresh,"utf-8")
                        
                         // generate token
                         const ACCESS_TOKEN =JWT.sign(payload,privateA,{expiresIn:"30m",algorithm:"RS256"})
                         const REFRESH_TOKEN =JWT.sign(payload,privateR,{expiresIn:"1d",algorithm:"RS256"})
                         // set cookie
                         res.cookie("ACCESS_TOKEN",ACCESS_TOKEN,{maxAge:1000*60*30,secure:false,httpOnly:true})
                         res.cookie("REFRESH_TOKEN",REFRESH_TOKEN,{maxAge:1000*60*60*24,secure:false,httpOnly:true})

                            res.send({success:"Editor created"})
                    }
               }
            })
        }catch(err){
            return res.status(500)
            .send({
                status:500,
                errors:err
            })
        }
    }

    static async invite(req : Request,res:Response){
        try{

            console.log(req.cookies)
            await validator({
                body:req.body,
                rules:{"EditorId":"required"},
                customessage:{},
                callback:async(err:any,status:any)=>{
                    
                    if(!status){
                        return res.status(412).send({
                            status:412,
                            message:"validation Failed",
                            data:err
                        })                                   
                    }
                    else{
                        const compteId = (req.user?._id as String)
                        const {EditorId} = req.body
                        console.log(mongoose.Types.ObjectId.isValid(EditorId),compteId)
                        const data = await Invitation.create({compteId,EditorId})
                        
                       return  res.send({
                            status:200,
                            message : 'Invitation send it successfully'
                        })
                    }
                    
                }
            })
        }
        catch(err){
           return  res.status(500).json({
                status:500,
                message : err
            })
        }
    }

    static async accept(req : Request,res : Response){
        try{
            // retreive editor 
            const EditorId = (req.user?._id) as string 
            // get invitation id from the parameters
            const {invitationId} = req.params  
            // get the invitation
            const invitation = await Invitation.findOne({_id:invitationId,EditorId})
            if(!invitation){
                return res.status(404)
                .send({
                    status:400,
                    maessage : "invitation does not exists"
                })
            }
            // upadate the Editor
            console.log({invitation})
            let editor = await Editor.findById(EditorId)
            editor?.Account.push((invitation.compteId as String))
            editor?.save()
            // sens success stataus
            res.status(200)
            .send({
                status:200,
                message:"Invitation Accepted Successfully"
            })
        }catch(err){
            // send error status
            return res.status(500)
            .send({
                status:500,
                message:(err as Error).message
            })
        }
    }

    static async bloc(req:Request ,res:Response){

    }

    static login(req:Request,res:Response){
        try{

            validator({
                body:req.body,
                rules:{"username":"required","password":"required"},
                customessage:{},
                callback:async(err:any,status:any)=>{
                if(err){
                    return res.status(500).send({
                        status:500,
                        message:"failed validation",
                        errors:err
                    })
                }
                else{
                    
                    const user = await Editor.findOne({username:req.body.username});
                    console.log(user,req.body)
                    if(user){
                        const password =await bcrypt.compare(req.body.password,(user?.password as string))
                        if(password){
                            let payload = {_id:user.id,username:user.username,email:user.email}
                            let token = generateAccess(payload)
                            res.cookie('ACCESS_TOKEN',token,{maxAge:1000*60*30,secure:false,httpOnly:true})
                            return  res.status(200)
                            .send({
                                status:200,
                                message:"login successfully"
                            })
                        }
                        return res.status(400)
                        .send({
                            status:400,
                            message : "passord does not match records"
                        })
                        
                    }
                    return res.status(412).send({
                        status:400,
                        message : "Editor does not exists"
                    })
                }
                res.send({status})
            }
        })
    }
    catch(err){
        throw Error(err.message)
    }
    }

}