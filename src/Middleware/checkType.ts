import { Request, Response } from "express";
import multer from "multer";

export const  CheckType = (upload)=>{
    return (req:Request,res:Response,next:CallableFunction)=>{
        upload(req,res,(err:any)=>{
            if(err instanceof multer.MulterError){
               return  res.send(412)
                .send({
                    status:412,
                    err : err
                })
            }
            else if(err){
                throw err;
            }
            next()
        })
    }
}