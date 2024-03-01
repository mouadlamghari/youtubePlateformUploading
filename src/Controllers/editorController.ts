import { Request, Response } from "express";
import { EditorInterface } from "../Inrefaces/EditorInrerface";
import Editor from "../Models/Editor";
import { ObjectId } from "mongodb";


export class EditorController{


    static async getActions(req:Request,res:Response){
        try {
            const editor = req.user as EditorInterface
            const editorId = editor._id
            const Actions = await Editor.findById(editorId,{username:true})
            .populate([{path:'actions',populate:[{path:"uploads"},{path:"compte",select:" lastName name email picture "}]},]) 
            
            return res.status(200)
            .json({
                status:200,
                data:Actions
            })
        } catch (error) {
            return res.status(500)
            .json({
                status:500,
                message:error.message
            })
        }
    }


    static async getInvitation(req:Request,res:Response){
        try {
            const editor = req?.user as EditorInterface
            const editorId = editor._id
            const Current = await Editor.findById(editorId).
            populate({path:'invitations',populate:{path:"compteId",select:" name lastName picture email ",model:"User"}});
            
            const Invitations = Current.invitations;
            return res.status(200)
            .json({
                status:200,
                data : Invitations
                })
        } catch (error) {
            return res.status(500)
            .json({
                status : 500,
                data : error.message
            })
        }
    }

    static async getAccounts(req:Request,res:Response){
        try {
            const editorId = (req.user as EditorInterface )._id 
            const editor = await Editor.findById(editorId).populate({path:"Account",select:"email lastName name picture"});
            const accounts = editor.Account
            res.status(200)
            .json({
                status:200,
                data:accounts
            })           
        } catch (error) {
            if(error instanceof Error){
                res.status(500)
                .json({
                    status:500,
                    message:error.message
                })
            }
        }
    }
    
}