import mailer from "nodemailer"
import { ApiError } from "../Utils/ApiError";

interface MailInterface{
    from :string;
    to : string;
    subject  : string;
    text? : string;
    html?:string;
}

export class Mail {
    public options;
    public mailer;
    constructor(options : MailInterface){
        this.options = options
        this.mailer=mailer.createTransport(
            {
                host: "smtp-relay.brevo.com",
                port: 587,
                auth: {
                    user: '73120b75bed5ad',
                    pass: process.env['PASSWORD']
                }
            }
        );
    }
    async send(){
        await this.mailer.sendMail(this.options,function(err,data){
            if(err){
                throw new ApiError((err as Error).message);
            }
        })
    }
};