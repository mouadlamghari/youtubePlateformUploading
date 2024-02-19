import { Request, Response } from "express";
import { validator } from "../Utils/Validator";
import UploadAction from "../Models/UploadAction";
import Action from "../Models/Action";
import { Actions } from "../Utils/enums";
import { UploadToYoutube } from "../Service/UploadToYoutube";
import { userChannel } from "../Utils/channel";
import { upload } from "../Service/UploadFile";



export default class UploadContent{
    static upload (req : Request,res : Response){
        console.log(req.file)
        try{
         validator({
            body:req.body,
            rules:{
            "title":"required|min:1",
            description:"required|min:1",
            tags:"required",
            categoryId:"required|numeric",
            privacyStatus:"required|string",
            keywords:"required|min:2|string",            
        },
            customessage:{},
            callback:async(err:any,status:any)=>{
                    console.log(req.body)
                    if(!status){
                      return  res.status(412)
                        .send({
                            status:412,
                            message : "validation Failed",
                            error : err
                        })
                    }
                    else{
                    const {title,description,tags,categoryId,privacyStatus,keywords}=req.body
                    const {account}=req.query
                    const editor=req.user._id
                    const action=Actions.upload
                    const videoUrl = req.file?.path
                    const newAction = await Action.create({compte:account,editor,action})
                    const newUpload = await UploadAction.create({action:newAction._id,title,description,tags,categoryId,privacyStatus,keywords,videoUrl})
                    res.status(200).send({
                        status:200,
                        message:"video uploaded successfully"
                    })
                    }
            }
        })
    }
    catch(err){
        throw err;
    }

    }

    static async approve(req :Request ,res : Response){
        try {
            const {action}=req.body
            const {raison,approved}=req.body
            let newAction =await  Action.findById(action)
            if(!newAction){
                return res.status(404).json({
                    status:404,
                    message:"Action not found"
                })
            }
            const Upload = await UploadAction.findOne({action})
            if(newAction?.compte?.toString()!==req.user?._id){
                return res.status(401).json({
                    status:401,
                    message:"you dont have right authorization to access this Action"
                })
            }
            validator({
                body:req.body,
                rules:{"approved":"required|boolean","reason":"required_if:approved,false"},
                customessage:{},
                callback:async(err,status)=>{
                    if(status){
                        const tokens = (req.user?.tokens)
                        const payload = {
                            title:Upload?.title,
                            description:Upload?.description,
                            categorie:Upload?.categoryId,
                            tags:Upload?.tags,
                            status:Upload?.privacyStatus,
                            file:Upload?.videoUrl              
                        };
                        UploadToYoutube(tokens,payload)
                        res.send({
                            status:200,
                            message:"Action commited"
                        })
                    }
                    else{
                        return res.status(500)
                        .send({
                            status:412,
                            message:"validation failed",
                            errors:err
                        })
                    }
                }
            })
            
        } catch (error) {
            throw error;
        }

    }  
    
}

