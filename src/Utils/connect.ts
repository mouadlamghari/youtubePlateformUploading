import {ConnectOptions, connect} from "mongoose"


export async function DbConnect(){
    try{
        const url : string  = process.env['DB_URL']
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
