import { NextFunction, Request, Response } from "express";
import path from "path";
import fs from 'fs'
import JWT from "jsonwebtoken"
import { abort } from "process";
import crypto from "crypto"

export default function chechAuth(req:Request,res:Response,next : NextFunction){


        if(req.isAuthenticated()){
            return next();
        }

        // access token
        const accessToken : string  = ( req.cookies['ACCESS_TOKEN'] as string )

        // get access tokens from file 
        const tokenPath :string = path.resolve("src","secrets_public.pem")
        const token : string = fs.readFileSync(tokenPath,"utf8")
        try{
            // decode the user 
            const decode = JWT.verify(accessToken,token)
            console.log(decode)
            req.user = decode
           return  next()
        }
        catch(err){
            // return unuthorized 
            return res.status(401).send({
                status:401,
                message:"unuthorized"
            })
        }

}