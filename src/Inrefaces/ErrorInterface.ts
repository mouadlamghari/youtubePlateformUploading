export interface ErrorInterface{
    code : number
    keyPattern :{username:string,email:string}
    message : string
    properties : {path:string,message:string}
    errors : ErrorInterface[]
}