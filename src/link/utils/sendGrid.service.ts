/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

console.log(process.env.SENDGRID_API_KEY);
@Injectable()
export class SendGridService {
  async sendEmail(emailOptions: sgMail.MailDataRequired): Promise<void> {
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      await sgMail.send(emailOptions);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
