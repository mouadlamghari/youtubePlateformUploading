import { Request, Response } from "express";

export function stream(req:Request,res:Response){
    console.log(req.params.url)
}