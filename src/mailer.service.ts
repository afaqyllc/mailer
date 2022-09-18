import { MailerService as MailService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SmtpMailInterface } from '@afaqy/core';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: MailService) {}

  public async sendEmail({
    receiver,
    subject,
    body,
    from,
  }: SmtpMailInterface): Promise<any> {
    let sentMail;
    const options = {
      to: receiver, // List of receivers email address
      subject, // Subject line
      html: body, // HTML body content
    };
    if (from) {
      options['from'] = from;
    }
    console.log(options);
    try {
      sentMail = await this.mailerService.sendMail(options);
    } catch (e) {
      console.log({ errorWhileSending: e });
      throw new InternalServerErrorException(e);
    }
    console.log({ sentMail });
    return sentMail;
  }
}
