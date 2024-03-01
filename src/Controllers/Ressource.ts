import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import Action from '../Models/Action';
import User from '../Models/User';
import UploadAction from '../Models/UploadAction';
import Editor from '../Models/Editor';
import Invitation from '../Models/Invitation';
import mongoose from 'mongoose';
import {  User as UserInterface } from '../Inrefaces/UserI';

export class RessourceController{
    static async getListChannels(req : Request,res : Response){
        try {
            const auth = new OAuth2Client({
                clientId :  process.env['CLIENT_ID'],
                clientSecret : process.env['CLIENT_SECRET'],
                redirectUri:"http://localhost:5174"  
            })
            const user = req?.user as UserInterface
            auth.setCredentials(user?.tokens);
    
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
            if(error instanceof Error){
                return res.status(500)
                .json({
                    status:500,
                    error:error.message
                })
            }
        }
        
    }

    static async getVidoes(req : Request,res : Response){
        try {
            const user = (req.user as UserInterface)._id;
            console.log(user)
            console.log("hana")
            const videos = await UploadAction.find({action:{$ne:null}})
            .populate({path:"action",select:'_id,editor',match:{"approved":true,},populate:{path:"editor",select:["username","name"]}});
            let filterVideo = videos.filter(e=>e.action!=null);
            res.status(200).send({
                    status : 200,
                    data : filterVideo})
        } catch (error) {
            if(error instanceof Error){
                return res.status(500).send({
                    status:500,
                    error:error.message
                })
            }
        }
    }

    static async getActions(req : Request,res : Response){
        try {
            const reqUser = req?.user as UserInterface
            const user = reqUser?._id
            let actions = await Action.find({compte:user})
            .populate([{path:"editor",select:" email lastname name username "},{path:"uploads",select:"description keywords privacyStatus tags title videoUrl "}])
            
            return res.status(200)
            .json({
                status:200,
                data:actions 
            })
        } catch (error) {
            if(error instanceof Error){
                return res.status(500)
                .send({
                    status:500,
                    error : error.message
                })
            }
        }
    }

    static async getEditors(req:Request,res:Response){
        try {
            const reqUser = req?.user as UserInterface
            const user = reqUser?._id
            const editors =await Editor.find({Account:{$elemMatch:{$eq:"65d32bc84cf801a46a4b9cfd"}}},{Account:0,password:0}).populate({path:"actions",populate:{path:"uploads"}}).lean()
            console.log(editors)
            return res.status(200)
            .json({
                status:200,
                data:editors
            })
        } catch (error) {
            if(error instanceof Error){
                return res.status(500)
                .send({
                    status:500,
                    error : error?.message
                })   
            }
        }
    }

    static async getInvitations(req:Request,res:Response){
        try {
            const reqUser = req?.user as UserInterface
            const user = reqUser?._id
            const invitations = await Invitation.find({compteId:"65d32bc84cf801a46a4b9cfd"},)
            .populate({path:"EditorId",select:["username","email","name","lastname"]})
            
            
            return res.status(200)
            .send({
                status:200,
                data:invitations 
            })
        } catch (error) {
            if(error instanceof Error){
                return res.status(500)
                .json({
                    status:500,
                    errors : error.message
                })
            }
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
                            {username:{$regex:query}}
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
            if(error instanceof Error){
                return  res.status(500)
                .json({
                    status:500,
                    message:error.message
                })
            }
        }
    }

    static async getCategories(req:Request ,res:Response){
        try{
            const list = [
                { id: '1', title: 'Film & Animation' },
                { id: '2', title: 'Autos & Vehicles' },
                { id: '10', title: 'Music' },
                { id: '15', title: 'Pets & Animals' },
                { id: '17', title: 'Sports' },
                { id: '18', title: 'Short Movies' },
                { id: '19', title: 'Travel & Events' },
                { id: '20', title: 'Gaming' },
                { id: '21', title: 'Videoblogging' },
                { id: '22', title: 'People & Blogs' },
                { id: '23', title: 'Comedy' },
                { id: '24', title: 'Entertainment' },
                { id: '25', title: 'News & Politics' },
                { id: '26', title: 'Howto & Style' },
                { id: '27', title: 'Education' },
                { id: '28', title: 'Science & Technology' },
                { id: '30', title: 'Movies' },
                { id: '31', title: 'Anime/Animation' },
                { id: '32', title: 'Action/Adventure' },
                { id: '33', title: 'Classics' },
                { id: '34', title: 'Comedy' },
                { id: '35', title: 'Documentary' },
                { id: '36', title: 'Drama' },
                { id: '37', title: 'Family' },
                { id: '38', title: 'Foreign' },
                { id: '39', title: 'Horror' },
                { id: '40', title: 'Sci-Fi/Fantasy' },
                { id: '41', title: 'Thriller' },
                { id: '42', title: 'Shorts' },
                { id: '43', title: 'Shows' },
                { id: '44', title: 'Trailers' }
              ]
              return res.status(200)
              .json({
                status:200,
                data:list
              })
        }catch(error){
            if( error instanceof Error ){
                return res.status(500).json({
                    status:500,
                    messagr:error.message
                })
            }
        }
    }

    static async getAction(req:Request , res : Response){
        try {
            const data = await UploadAction.findById(req.params.id)
            return res.status(200)
            .json({
                status:200,
                data
            })
        } catch (error) {
            return res.status(200)
            .json({
                status:500,
                message:error.message
            })           
        }
    }
}