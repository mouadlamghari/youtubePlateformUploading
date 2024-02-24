import { TokenInterface } from "./TokenInterface"

export interface User{
    _id : string ,
    name  : string | undefined ,
    lastName : string | undefined
    email : string | undefined ,
    picture : string | undefined ,
    username : string | undefined,
    tokens : TokenInterface
}