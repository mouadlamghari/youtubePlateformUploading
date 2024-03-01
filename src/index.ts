import express, { Request, Response } from "express"
import cors from "cors"
import {Strategy as Google,Profile} from "passport-google-oauth20"
import session from "express-session"
import passport from "passport"
import {config} from "dotenv"
import * as Auth from "./Routes/Auth"
import * as Editor from "./Routes/Editors"
import * as Content from "./Routes/Content"
import * as Ressource from "./Routes/Ressource"
import mongoose from "mongoose"
import { DbConnect } from "./Utils/connect"
import User from "./Models/User"
import cookieParser from 'cookie-parser'
import path from "path"
import { Mail } from "./Service/Mail"



config({path:path.resolve(__dirname,'.env')})
const app = express()
console.log(__dirname)
app.use("/static",express.static(__dirname+"/upload"))

app.use(cookieParser())
app.use(express.json({limit:"1gb"}))
app.use(express.urlencoded({extended:true}))

app.use(session({name:"AUTH",
secret:`${process.env["SESSION_SECRET"]}`,
resave:false,
saveUninitialized:true,
}));

app.use(cors({
    origin:"http://localhost:5174",
    credentials:true,
    methods:"GET,POST,PUT,DELETE",
}))




passport.use( new Google({
    clientID: `${process.env['CLIENT_ID']}`,
    clientSecret: `${process.env['CLIENT_SECRET']}`,
    callbackURL: "http://localhost:3000/auth/google/callback",    
    passReqToCallback:true,
    
    tokenURL:"https://oauth2.googleapis.com/token",
    scope: ['profile', 'email', "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtubepartner",
    "https://www.googleapis.com/auth/youtube.force-ssl"],
},async function(request:Request,accessToken:string,refresh:string,tokens:Object,profile:Profile,done:CallableFunction){

    const user = await User.findOneAndUpdate({email:profile?._json?.email},{tokens})
    if(!user){
        const newuser = await User.create({
            name: profile._json?.family_name,
            lastName:profile?._json?.given_name,
            email:profile?._json.email,
            picture:profile?._json.picture,
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


app.get('/mail',async (req:Request,res:Response)=>{
    try{
        const n = new Mail({from:"lamgharimouad70@gmail.com",to:"lamgharimouad007@gmail.com","subject":"somthimes",html:"<div>ATA</div>"})
        await n.send()
    }catch(err){
        res.status(500)
        .send({err:err})
    }
})

// mongoose.set('debug',true)

app.use((err:Error,req:Request,res:Response,next:CallableFunction)=>{
  console.log(err)
  if(err instanceof Error){
    console.log(err)
    return  res.status(500).json({
      err:err
    })
  }
  return res.status(500).send(err)
})

app.get('/list',async(req,res)=>{
    
    const list = [
        {
          "kind": "youtube#videoCategory",
          "etag": "grPOPYEUUZN3ltuDUGEWlrTR90U",
          "id": "1",
          "snippet": {
            "title": "Film & Animation",
            "assignable": true,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "Q0xgUf8BFM8rW3W0R9wNq809xyA",
          "id": "2",
          "snippet": {
            "title": "Autos & Vehicles",
            "assignable": true,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "qnpwjh5QlWM5hrnZCvHisquztC4",
          "id": "10",
          "snippet": {
            "title": "Music",
            "assignable": true,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "HyFIixS5BZaoBdkQdLzPdoXWipg",
          "id": "15",
          "snippet": {
            "title": "Pets & Animals",
            "assignable": true,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "PNU8SwXhjsF90fmkilVohofOi4I",
          "id": "17",
          "snippet": {
            "title": "Sports",
            "assignable": true,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "5kFljz9YJ4lEgSfVwHWi5kTAwAs",
          "id": "18",
          "snippet": {
            "title": "Short Movies",
            "assignable": false,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "ANnLQyzEA_9m3bMyJXMhKTCOiyg",
          "id": "19",
          "snippet": {
            "title": "Travel & Events",
            "assignable": true,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "0Hh6gbZ9zWjnV3sfdZjKB5LQr6E",
          "id": "20",
          "snippet": {
            "title": "Gaming",
            "assignable": true,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "q8Cp4pUfCD8Fuh8VJ_yl5cBCVNw",
          "id": "21",
          "snippet": {
            "title": "Videoblogging",
            "assignable": false,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "cHDaaqPDZsJT1FPr1-MwtyIhR28",
          "id": "22",
          "snippet": {
            "title": "People & Blogs",
            "assignable": true,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "3Uz364xBbKY50a2s0XQlv-gXJds",
          "id": "23",
          "snippet": {
            "title": "Comedy",
            "assignable": true,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "0srcLUqQzO7-NGLF7QnhdVzJQmY",
          "id": "24",
          "snippet": {
            "title": "Entertainment",
            "assignable": true,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "bQlQMjmYX7DyFkX4w3kT0osJyIc",
          "id": "25",
          "snippet": {
            "title": "News & Politics",
            "assignable": true,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "Y06N41HP_WlZmeREZvkGF0HW5pg",
          "id": "26",
          "snippet": {
            "title": "Howto & Style",
            "assignable": true,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "yBaNkLx4sX9NcDmFgAmxQcV4Y30",
          "id": "27",
          "snippet": {
            "title": "Education",
            "assignable": true,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "Mxy3A-SkmnR7MhJDZRS4DuAIbQA",
          "id": "28",
          "snippet": {
            "title": "Science & Technology",
            "assignable": true,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "4pIHL_AdN2kO7btAGAP1TvPucNk",
          "id": "30",
          "snippet": {
            "title": "Movies",
            "assignable": false,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "Iqol1myDwh2AuOnxjtn2AfYwJTU",
          "id": "31",
          "snippet": {
            "title": "Anime/Animation",
            "assignable": false,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "tzhBKCBcYWZLPai5INY4id91ss8",
          "id": "32",
          "snippet": {
            "title": "Action/Adventure",
            "assignable": false,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "ii8nBGYpKyl6FyzP3cmBCevdrbs",
          "id": "33",
          "snippet": {
            "title": "Classics",
            "assignable": false,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "Y0u9UAQCCGp60G11Arac5Mp46z4",
          "id": "34",
          "snippet": {
            "title": "Comedy",
            "assignable": false,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "_YDnyT205AMuX8etu8loOiQjbD4",
          "id": "35",
          "snippet": {
            "title": "Documentary",
            "assignable": false,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "eAl2b-uqIGRDgnlMa0EsGZjXmWg",
          "id": "36",
          "snippet": {
            "title": "Drama",
            "assignable": false,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "HDAW2HFOt3SqeDI00X-eL7OELfY",
          "id": "37",
          "snippet": {
            "title": "Family",
            "assignable": false,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "QHiWh3niw5hjDrim85M8IGF45eE",
          "id": "38",
          "snippet": {
            "title": "Foreign",
            "assignable": false,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "ztKcSS7GpH9uEyZk9nQCdNujvGg",
          "id": "39",
          "snippet": {
            "title": "Horror",
            "assignable": false,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "Ids1sm8QFeSo_cDlpcUNrnEBYWA",
          "id": "40",
          "snippet": {
            "title": "Sci-Fi/Fantasy",
            "assignable": false,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "qhfgS7MzzZHIy_UZ1dlawl1GbnY",
          "id": "41",
          "snippet": {
            "title": "Thriller",
            "assignable": false,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "TxVSfGoUyT7CJ7h7ebjg4vhIt6g",
          "id": "42",
          "snippet": {
            "title": "Shorts",
            "assignable": false,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "o9w6eNqzjHPnNbKDujnQd8pklXM",
          "id": "43",
          "snippet": {
            "title": "Shows",
            "assignable": false,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        },
        {
          "kind": "youtube#videoCategory",
          "etag": "mLdyKd0VgXKDI6GevTLBAcvRlIU",
          "id": "44",
          "snippet": {
            "title": "Trailers",
            "assignable": false,
            "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
          }
        }
      ]

      const nl = list.map(item=>({id:item.id,title:item.snippet.title}))
      console.log(nl)
    
    //const list1 =  await getCategories(token)
    return res.send({
        list
    })
}
)




app.all("*",(req,res)=>{
    res.status(404).json({
        status:404,
        message:`Not Found ${req.url}`
    })
})



app.listen(3000,()=>{
    DbConnect()
    console.log(`runing on port ${3000}   `)
})