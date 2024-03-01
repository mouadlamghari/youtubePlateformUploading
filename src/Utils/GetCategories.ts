import { google } from "googleapis";
import { OAuth2Client } from 'google-auth-library';

export  async function getCategories(tokens){
    console.log(tokens)
    const oauth = new OAuth2Client({
        clientId:process.env['CLIENT_ID'],
        clientSecret:process.env['CLIENT_SECRET']
    })
    oauth.setCredentials(tokens)

    const provider = google.youtube({version:"v3",auth:oauth})


    const region = provider.i18nRegions.list({part:['id']});
   // return region;


    let list = await provider.videoCategories.list({part:["id"],regionCode:"MA"})
    return list
}