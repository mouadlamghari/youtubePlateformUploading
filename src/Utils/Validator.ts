import Validator from "validatorjs"

interface validation{
    body : Object,
    rules : Validator.Rules,
    customessage : Validator.ErrorMessages,
    callback : CallableFunction
}

export const validator = async ({body,rules,customessage,callback}:validation)=>{
        const validator = new Validator(body,rules,customessage)
        validator.passes(()=>callback(null,true))
        validator.fails(()=>callback(validator.errors,false))
}