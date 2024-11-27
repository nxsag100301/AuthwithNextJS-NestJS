import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) { }

    public sendEmail(data): void {
        this.mailerService
            .sendMail({
                to: data.email, // list of receivers
                subject: 'Activate your account', // Subject line
                template: 'register.hbs',
                context: { // ✏️ filling curly brackets with content
                    name: data?.name ?? data.email,
                    activationCode: data.codeId
                },
            })
            .then(() => {
                // console.log('check data', data)
            })
            .catch(() => { })
    }
}