import express, { Request, Response } from "express"
import cors from "cors"
import {Strategy as Google} from "passport-google-oauth20"
import session from "express-session"
import passport from "passport"
import {config} from "dotenv"
import { envirements } from "./env.js"
import * as Auth from "./Routes/Auth"
import * as Editor from "./Routes/Editors"
import * as Content from "./Routes/Content"
import * as Ressource from "./Routes/Ressource"
import mongoose from "mongoose"
import crypto from "crypto"
import { DbConnect } from "./Utils/connect.js"
import User from "./Models/User.js"
import cookieParser from 'cookie-parser'
import { abort } from "process"
import { google } from "googleapis"
import fs from "fs"
import path from "path"
const app = express()



config()
app.use(cookieParser())
app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.use(session({name:"AUTH",
secret:`${process.env.SESSION_SECRET}`,
resave:true,
saveUninitialized:true,
cookie:{maxAge:1000*60*60*24,httpOnly:false,secure:false}
}));

app.use(cors({
    origin:"http://localhost:5174",
    credentials:true,
    methods:"GET,POST,PUT,DELETE"
}))




passport.use( new Google({
    clientID: `${envirements.CLIENT_ID}`,
    clientSecret: `${envirements.CLIENT_SECRET}`,
    callbackURL: "http://localhost:3000/auth/google/callback",    
    passReqToCallback:true,
    tokenURL:"https://oauth2.googleapis.com/token",
    scope: ['profile', 'email', "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtubepartner",
    "https://www.googleapis.com/auth/youtube.force-ssl"],
},async function(request,accessToken,refresh,tokens,profile,done){

    const user = await User.findOneAndUpdate({email:profile?._json?.email},{tokens})
    if(!user){
        const newuser = await User.create({
            name: profile._json?.family_name,
            lastName:profile._json?.given_name,
            email:profile._json.email,
            picture:profile._json.picture,
            access_token:accessToken,
            tokens:tokens
        })
        return done(null,newuser._id)
    }    
    return done(null,user._id)
}))

app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser((user,done)=>{
   return done(null,user)
})

passport.deserializeUser(async(id:string,done)=>{
    const user = await User.findOne({_id:id})
    done(null,user)
})


mongoose.connection.on("error",(err)=>{
    console.log(err)
})

mongoose.connection.on("connected",()=>{
    //throw Error(err);
})


app.use('/auth',Auth.default)
app.use('/Editors',Editor.default)
app.use('/Content',Content.default)
app.use('/ressource',Ressource.default)

mongoose.set('debug',true)

app.use((err,req:Request,res:Response,next:CallableFunction)=>{
    res.json({
        err:err
    })
})

app.all("*",(req,res)=>{
    res.json({
        status:404,
        message:`Not Found ${req.url}`
    })
})


app.listen(3000,()=>{
    DbConnect()
    console.log(`runing on ${3000} port`)
})