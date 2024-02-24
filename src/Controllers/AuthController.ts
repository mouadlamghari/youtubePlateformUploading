import { Request, Response, response } from "express";
import fs from "fs";
import JWT from "jsonwebtoken";
import passport from "passport";
import path from "path";
import crypto from "crypto"
import { User } from "../Inrefaces/UserI";


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
        const refreshToken = req.header("AUTHORIZATION")
        if(!refreshToken){
            return res.status(401).send({
                message:"no refresh token provided"
            })
        }
        try {
            // secret access token 
            const pathToken = path.resolve("secrect_private_refresh.pem")
            const token = fs.readFileSync(pathToken,"utf-8")
            // secret refresh token
            let pathToAccess : string = path.resolve("secrets_private.pem")
            let privateAccess : Buffer =   fs.readFileSync(pathToAccess)
            const privateA = crypto.createPrivateKey(privateAccess);
            
            const decode =  JWT.verify(refreshToken,token);
            const accessToken = JWT.sign(decode,privateA,{algorithm:"RS256",expiresIn:"30m"}) 
            return res.cookie('ACCESS_TOKEN',accessToken,{secure:false,httpOnly:true,maxAge:1000*60*30})
            .send("token retreive it")

        } catch (error) {
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

