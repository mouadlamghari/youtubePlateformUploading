import {config} from 'dotenv'
config()
export const envirements  =  {CLIENT_ID:process.env['CLIENT_ID'],CLIENT_SECRET:process.env["CLIENT_SECRET"]}