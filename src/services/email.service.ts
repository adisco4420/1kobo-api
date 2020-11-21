import env from '../env';
const mailgun = require('mailgun-js')({apiKey: env.MAILGUN_KEY, domain: 'email.vasrefil.com'});


class EmailService {
    private readonly companyName = '1Kobo'
    private readonly companyEmail = 'info@1kobo.com'
    private readonly baseUrl = 'http://1kobo.ng'

    private sendMail(data) {
        return mailgun.messages().send(data, (error, body) => {
            console.log(body);
            if(error) {
                return body
            } else { 
                return body
            }
        });
    }
    confirmEmail(payload) {
        const data = {
            from: `${this.companyName} <${this.companyEmail}>`,
            to: payload.email,
            subject: 'Verify Email Address',
            html: `
                <p>Hello, Welcome to ${this.companyName},</p>
                <p>Verify your email address <a href='${this.baseUrl}/confirm/${payload.token}'>verify</a></p>
                `
        };
        this.sendMail(data);
    }


}
export default new EmailService;