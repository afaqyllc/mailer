import { MailerService as MailService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SmtpMailInterface } from './smtp-mail.interface';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: MailService) {}

  public async sendEmail({
    receiver,
    subject,
    body,
    from,
  }: SmtpMailInterface): Promise<SentMessageInfo> {
    let sentMail: SentMessageInfo;
    const options = {
      to: receiver, // List of receivers email address
      subject, // Subject line
      html: body, // HTML body content
    };
    from && Object.assign(options, { from });
    try {
      sentMail = await this.mailerService.sendMail(options);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
    return sentMail;
  }
}
