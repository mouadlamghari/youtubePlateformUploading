import {ConnectOptions, connect} from "mongoose"


export async function DbConnect(){
    try{
        const url : string | undefined = process.env['DB_URL'] 
        
        console.log(url)
        if(!url){
             throw Error("No url db provided");
        }

        await connect(url,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        } as ConnectOptions)
    }
    catch(err){
        console.log(err)
        throw Error((err as Error).message)
    }
}
