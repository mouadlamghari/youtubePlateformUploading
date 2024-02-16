import fs from "fs"
import {google} from "googleapis"
import path from "path"
import { OAuth2Client } from 'google-auth-library';
const user = new OAuth2Client(process.env['CLIENT_ID'],process.env['CLIENT_SECRET'])
// access token
user.setCredentials({ access_token: ""});
const Service = google.youtube({version:"v3",auth:user})
export async function UploadToYoutube (data){
    const url = path.resolve("uploads/1707939904612..mp4")
    console.log(user)
    try{
       const res = await  Service.videos.insert({
            part:"snippet,id",
            requestBody:{
                snippet:{
                    title:"sothing new solthing freesh ",
                    description:"mouad",
                    tags:["mouad","upload","video"],
                    categoryId:22,
                },
                status:{
                    privacyStatus:"public"
                }     
            },
            media:{
                body:fs.createReadStream(url)
            },
        })
        console.log(res)
    }catch(err){
        console.log(err)
        throw err;
    }
}