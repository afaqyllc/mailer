import { Module } from '@nestjs/common';
import { MailerModule as MailModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    MailModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('EMAIL_HOST');
        const port = configService.get<number>('EMAIL_PORT');
        const user = configService.get<string>('EMAIL_ID');
        const pass = configService.get<string>('EMAIL_PASS');
        return {
          transport: {
            host,
            port,
            secure: true,
            auth: {
              user,
              pass,
            },
            tls: {
              ciphers: 'SSLv3',
              rejectUnauthorized: false,
            },
            socketTimeout: 120000,
          },
          defaults: {
            from: `ZAIN ERENT <${user}>`, // outgoing email ID
          },
          template: {
            dir: process.cwd() + '/template/',
            adapter: new HandlebarsAdapter(), // or new PugAdapter()
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailerService, ConfigService],
  exports: [MailerService],
})
export class MailerModule {}
