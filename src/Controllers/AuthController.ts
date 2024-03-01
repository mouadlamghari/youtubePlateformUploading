import { Request, Response, response } from "express";
import fs from "fs";
import JWT from "jsonwebtoken";
import passport from "passport";
import path from "path";
import crypto from "crypto"
import { User } from "../Inrefaces/UserI";
import { generateAccess } from "../Utils/GenerateTokenAccess";


export default class AuthController{


    static login(req : Request  ,res :Response ,next : CallableFunction ){
        passport.authenticate("google",{scope:["profile","email",
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube",
        "https://www.googleapis.com/auth/youtubepartner",
        "https://www.googleapis.com/auth/youtube.force-ssl"

    ]})(req,res,next)
    }
    
    static callback(req :Request ,res :Response ,next :CallableFunction ){
        console.log(req.query.code)
        passport.authenticate('google',{successMessage:"logged in",successRedirect:'http://localhost:5174/success'})(req,res,next)
    }
    
     static refresh(req : Request ,res : Response){
        const refreshToken = req.cookies["REFRESH_TOKEN"]
        if(!refreshToken){
            return res.status(401).send({
                message:"no refresh token provided"
            })
        }
        try {
            // secret access token 
            const pathToken = path.resolve("src","secrect_public_refresh.pem")
            const token = fs.readFileSync(pathToken,"utf-8")
            
            const decode =  JWT.verify(refreshToken,token) as {_id:string,username:string,email:string};
            const accessToken = generateAccess({_id:decode._id,username:decode.username,email:decode.email})
            return res.cookie('ACCESS_TOKEN',accessToken,{secure:false,httpOnly:true,maxAge:1000*60*30})
            .send({
                status:200,
                messgae:"token retreive it"
            })

        } catch (error) {
            console.log(error)
            res.status(400).send({
                status:400,
                message:'Invalid refresh token'
            })
        }
    }

    static user(req : Request , res : Response){
       try {
        const requser = req.user as User
            const user ={
                name : requser.name,
                email : requser.email,
                lastName : requser.lastName,
                picture: requser.picture,
                username : requser.username
            }
            return res.send({
                status:200,
                user
            })  
        } catch (error) {
            return res.json({
                status:500,
                error:error
            })
        }
    }

}

