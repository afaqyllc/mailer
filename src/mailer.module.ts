import { Module } from '@nestjs/common';
import { MailerModule as MailModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { MailerService } from './mailer.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MailModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('email.host');
        const port = configService.get<number>('email.port');
        const user = configService.get<string>('email.id');
        const pass = configService.get<string>('email.password');
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
            greetingTimeout: 120000,
          },
          defaults: {
            from: `AFAQY VDX <${user}>`, // outgoing email ID
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
