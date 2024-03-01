import { readFileSync } from "fs";
import jwt from "jsonwebtoken";
import { resolve } from "path";

export function generateAccess(data:Object){
    const path = resolve("src","secrets_private.pem")
    const access = readFileSync(path,"utf-8")
    const token = jwt.sign(data,access,{expiresIn:1000*60*30,algorithm:"RS256"})
    return token
}
export function generateRefresh(data:Object){
    const path = resolve("src","secrect_private_refresh.pem")
    const access = readFileSync(path,"utf-8")
    const token = jwt.sign(data,access,{expiresIn:1000*60*60*24,algorithm:"RS256"})
    return token
}