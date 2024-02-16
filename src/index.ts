import express, { Request, Response } from "express"
import cors from "cors"
import {Strategy as Google} from "passport-google-oauth20"
import {Strategy as Youtube} from "passport-youtube-v3"
import session from "express-session"
import passport from "passport"
import {config} from "dotenv"
import { envirements } from "./env.js"
import * as Auth from "./Routes/Auth"
import * as Editor from "./Routes/Editors"
import * as Content from "./Routes/Content"
import mongoose from "mongoose"
import crypto from "crypto"
import { DbConnect } from "./Utils/connect.js"
import User from "./Models/User.js"
import cookieParser from 'cookie-parser'
import { abort } from "process"
const app = express()

//mongoose.disconnect()

config()
app.use(cookieParser())
app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.use(session({name:"AUTH",
secret:`${process.env.SESSION_SECRET}`,
resave:true,
saveUninitialized:true,
cookie:{maxAge:100*60*60*24,httpOnly:false,secure:false}
}));

app.use(cors({
    origin:"http://localhost:5500",
    credentials:true,
    methods:"GET,POST"
}))




passport.use( new Google({
    clientID: `${envirements.CLIENT_ID}`,
    clientSecret: `${envirements.CLIENT_SECRET}`,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback:true
},async function(request,accessToken,refresh,profile,done){
    const user = await User.findOne({email:profile._json.email})
    if(!user){
        const newuser = await User.create({
            name: profile._json?.family_name,
            lastName:profile._json?.given_name,
            email:profile._json.email,
            picture:profile._json.picture
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
    console.log(id)
    const user = await User.findOne({_id:id})
    console.log({user})
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