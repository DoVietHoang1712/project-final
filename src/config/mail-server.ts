import { MAILER_EMAIL_ID, MAILGUN_API_KEY, MAILGUN_DOMAIN } from "./secrets";
// tslint:disable-next-line: no-var-requires
const Mailgun = require("mailgun-js");

// tslint:disable-next-line: variable-name
const api_key = MAILGUN_API_KEY;
const domain = MAILGUN_DOMAIN;

class MailServer {
    private readonly mg = Mailgun({apiKey: api_key, domain});

    async sendMail(receiver: string, subject: string, text: string): Promise<any> {
        const data = {
            from: domain,
            to: receiver,
            subject,
            html: text,
        };
        this.mg.messages().send(data, (error: any, body: any) => {
            if (error) {
                console.log(error);
            }
            console.log(body);
        });
    }
}
export const MailService = new MailServer();
