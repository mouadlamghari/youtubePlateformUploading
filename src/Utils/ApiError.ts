export class ApiError extends Error{
    public isUser:boolean
    constructor(err : string){
        super()
        this.isUser=true
        this.message=err
    }

}