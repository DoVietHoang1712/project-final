import * as nodemailer from "nodemailer";
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, MAILER_EMAIL_ID, MAILER_PASSWORD } from "./secrets";
import Mail = require("nodemailer/lib/mailer");
import SMTPTransport = require("nodemailer/lib/smtp-transport");
import { Logger } from "@nestjs/common";
import * as AWS from "aws-sdk";
import SESTransport = require("nodemailer/lib/ses-transport");
class AWSMailer {
    private readonly logger = new Logger("Mailer");
    private readonly transporter = nodemailer.createTransport({
        SES: new AWS.SES({
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
            region: AWS_REGION,
            apiVersion: "2020-11-06",
        }),
        sendingRate: 1,
    });

    sendMailAws(receiver: string, subject: string, text: string): Promise<any> {
        const mailOptions: SESTransport.MailOptions = {
            from: `"HoangDo" ${MAILER_EMAIL_ID}`,
            to: receiver,
            subject,
            html: text,
        };
        return new Promise((resolve, reject) => {
            this.transporter.on("idle", () => {
                while (this.transporter.isIdle()) {
                    this.transporter.sendMail(mailOptions, (err: Error, info: SESTransport.SentMessageInfo) => {
                        if (err) {
                            console.error(err);
                            resolve({success: false});
                        } else {
                            this.logger.verbose(`Message sent: ${info.messageId}`);
                            this.logger.verbose(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
                            resolve({sucess: true});
                        }
                    });
                }
            });
        });
    }

    async sendMailsAws(receivers: string[], subject: string, text: string): Promise<void> {
        const mailOptions: Mail.Options = {
            from: MAILER_EMAIL_ID,
            bcc: receivers,
            subject,
            html: text,
        };
        const info = await this.transporter.sendMail(mailOptions) as SESTransport.SentMessageInfo;
        this.logger.verbose(`Message sent: ${info.messageId}`);
        this.logger.verbose(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
}

export const SMTPMailer = new AWSMailer();
