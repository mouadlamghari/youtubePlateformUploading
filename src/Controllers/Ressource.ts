import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import Action from '../Models/Action';
import User from '../Models/User';
import UploadAction from '../Models/UploadAction';
import Editor from '../Models/Editor';
import Invitation from '../Models/Invitation';
import mongoose from 'mongoose';

export class RessourceController{
    static async getListChannels(req : Request,res : Response){
        try {
            const auth = new OAuth2Client({
                clientId :  process.env['CLIENT_ID'],
                clientSecret : process.env['CLIENT_SECRET'],
                redirectUri:"http://localhost:5174"  
            })
            
            auth.setCredentials(req.user.tokens);
    
            const service = google.youtube({version:"v3",auth})
            const channels =await service.channels.list({
                part: ['snippet'], 
                mine: true,
            })
            let data = channels.data.items
            return res.status(200)
            .json({
                status:200,
                data
            })
        } catch (error) {
            console.log(error)
            return res.status(500)
            .json({
                status:500,
                error:error.maessage
            })
        }
        
    }

    static async getVidoes(req : Request,res : Response){
        try {
            //const user = req.user._id;
            const videos = await UploadAction.find({action:{$ne:null}})
            .populate({path:"action",select:'_id,editor',match:{"approved":true,},populate:{path:"editor",select:["username","name"]}});
            let filterVideo = videos.filter(e=>e.action!=null);
            res.status(200).send({
                    status : 200,
                    data : filterVideo})
        } catch (error) {
            return res.status(500).send({
                status:500,
                error:error.message
            })
        }
    }

    static async getActions(req : Request,res : Response){
        try {
            const user = req?.user?._id
            let actions = await Action.find({compte:"65d32bc84cf801a46a4b9cfd"})
            .populate({path:"editor",select:["username","name","email"]})
            console.log(actions)
            
            return res.status(200)
            .json({
                status:200,
                data:actions 
            })
        } catch (error) {
            return res.status(500)
            .send({
                status:500,
                error : error.message
            })
        }
    }

    static async getEditors(req:Request,res:Response){
        try {
            const user = req?.user?._id
            const editors =await Editor.find({Account:{$elemMatch:{$eq:"65d32bc84cf801a46a4b9cfd"}}},{Account:0,password:0}).populate({path:"actions",populate:{path:"uploads"}}).lean()
            console.log(editors)
            return res.status(200)
            .json({
                status:200,
                data:editors
            })
        } catch (error) {
            return res.status(500)
            .send({
                status:500,
                error : error?.message
            })   
        }
    }

    static async getInvitations(req:Request,res:Response){
        try {
            const user = req?.user?._id
            const invitations = await Invitation.find({compteId:"65d32bc84cf801a46a4b9cfd"})
            .populate({path:"EditorId",select:["username","email","name","lastname"]}); 
            console.log(invitations)
            return res.status(200)
            .send({
                status:200,
                data:invitations 
            })
        } catch (error) {
            return res.status(500)
            .json({
                status:500,
                errors : error.message
            })
        }
    }

    static getActionsEditor(req:Request , res:Response){

    }

    static async search(req:Request,res:Response){
        try {
            const {q}=req.query
            const query = `.*${q}.*`
            const userId  = "65d32bc84cf801a46a4b9cfd"
            const Editors = await Editor.aggregate([
                
                {
                    $match:{
                        $or:[
                            {name:{$regex:query}},
                            {email:{$regex:query}},
                            {lastname:{$regex:query}},
                        ]
                    },       
                },
                {$project:{
                    _id:1,
                    name:1,
                    lastname:1,
                    username:true,
                    email:true,
                    Account:true,
                    createdAt:true
                }},
                {$addFields:{min:{
                    $in:[userId,{
                       $map: { input : "$Account" , as : "a" , in:{$toString:"$$a"}}
                    }]}
                }},
                {$lookup:{
                    from:"Invitation",
                    localField:"_id",
                    let:{userId:userId},
                    foreignField:"EditorId",
                    pipeline:[
                        {$match:{
                            $expr:{
                                $and:[
                                   { $eq : ["$compteId",userId]},
                                   {$eq : ["$EditorId","$_id"]}
                                ]
                            }
                        }}
                    ],
                    as :"already"
                }},
                
            ]);
            console.log(Editors) 

            return res.status(200)
            .json({
                status:200,
                query:q,
                resultat:Editors
            })
        } catch (error) {
            return  res.status(500)
            .json({
                status:500,
                message:error.message
            })
        }
    }
}