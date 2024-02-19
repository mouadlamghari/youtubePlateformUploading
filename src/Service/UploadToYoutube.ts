import fs from "fs"
import {google} from "googleapis"
import path from "path"
import { OAuth2Client } from 'google-auth-library';




export async function UploadToYoutube (token,data){
    
    try{
        const authProvider = new OAuth2Client()
        let checkAuth = await authProvider.verifyIdToken({idToken:token.id_token,audience:process.env['CLIENT_ID']})
        
        // credentials auth
        const user = new OAuth2Client({
            clientId :  process.env['CLIENT_ID'],
            clientSecret : process.env['CLIENT_SECRET'],
            redirectUri:"http://localhost:5500"  
        })
        user.setCredentials(token);
        // upload video
        const Service = google.youtube({version:"v3",auth:user})
        const url = path.resolve(data?.file|| "")
        const res =await Service.videos.insert({
        part:["snippet","status"],
        requestBody:{
            snippet:{            
                title:data?.title,
                categoryId:data?.categorie,
                description:data.description,
                tags:data?.tags
            },  
            status:{
                privacyStatus:data.status
            }
        },
        media:{
            body:fs.createReadStream(url)
        }
       })
       const response = await res.data
       console.log(response)
    }
    catch(err){
        console.log(err)
    }
}