import fs from "fs";
import  JWT from "jsonwebtoken" 
import { Response,Request } from "express";
import path from "path"; 
import bcrypt from "bcrypt"
import { validator } from "../Utils/Validator";
import Invitation from "../Models/Invitation";
import mongoose from "mongoose";
import Editor from "../Models/Editor";
import { generateAccess } from "../Utils/GenerateTokenAccess";
import { handleErrors } from "../Utils/handelError";
import { User } from "../Inrefaces/UserI";
import { EditorInterface } from "../Inrefaces/EditorInrerface";
import { ErrorInterface } from "../Inrefaces/ErrorInterface";
export default class Editors{
    /*
    create an editor
     */
    static async editor(req :Request ,res:Response) {

            //data validation
            await validator({body:req.body,
                rules:{"username":"required|min:4","email":"required","password":'required|min:8','name':'required','lastname':'required'},
               customessage:{},
               callback:async (error:any,status:any)=>{
                try {
                    if(!status){
                        // send error message
                       return  res.status(412).send({
                                    status:412,
                                    message:"Validation failed",
                                    errors:error.errors
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

                           return  res.send({status:200,success:"Editor created"})
                    }
                } catch (error) {
                    return res.status(500)
                    .json({
                        status:400,
                        errors:handleErrors(error as ErrorInterface) 
                    })
                }
                    
               }
            })
        
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
                        const user = req.user as User
                        const compteId = (user._id as String)
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
            const editorReq = req.user as EditorInterface
            const EditorId = (editorReq?._id) 
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
            // update accepted
            invitation.accepted="confirm";
            invitation.save()
            

            // upadate the Editor
            let editor = await Editor.findById(EditorId)
            const comptId =(invitation.compteId as any)
            editor?.Account.push(invitation.compteId)
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

    static async refuse(req : Request , res : Response){
        try {
            // retreive editor
            const reqEditor =  req.user as EditorInterface
            const EditorId = (reqEditor._id) 
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
            invitation.accepted="refuse";
            return res.status(200)
            .json({
                status:200,
                mesaage : "invitation refused"
            })
        } catch (error) {
            let message;
            if(error instanceof Error) message = error.message;
            return res.status(500).send({
                status:500,
                error : message
            })
        }
    }

    static login(req:Request,res:Response){
        try{

            validator({
                body:req.body,
                rules:{"username":"required","password":"required"},
                customessage:{},
                callback:async(err:any,status:any)=>{
                    // validation failed
                if(err){
                    return res.status(500).send({
                        status:500,
                        message:"failed validation",
                        errors:err
                    })
                }
                else{
                    // check if user exixts
                    const user = await Editor.findOne({username:req.body.username});
                    if(user){
                        // check if password match
                        const password =await bcrypt.compare(req.body.password,(user?.password as string))
                        if(password){
                            let payload = {_id:user.id,username:user.username,email:user.email}
                            let token = generateAccess(payload)
                            // set token in token
                            res.cookie('ACCESS_TOKEN',token,{maxAge:1000*60*30,secure:false,httpOnly:true})
                            // return success message
                            return  res.status(200)
                            .send({
                                status:200,
                                message:"login successfully"
                            })
                        }
                        // return error if password does not match
                        return res.status(400)
                        .send({
                            status:400,
                            message : "passord does not match records"
                        })
                        
                    }
                    // return error if editor does not exists
                    return res.status(412).send({
                        status:400,
                        message : "Editor does not exists"
                    })
                }
            }
        })
    }
    catch(err){
        if(err instanceof Error){
            throw Error(err.message)
        }
    }
    }

}