import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MailerModule as MailModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { MailerService } from './mailer.service';
import {
  MAILER_OPTIONS,
  MailerModuleAsyncOptions,
  MailerModuleOptions,
  MailerOptionsFactory,
} from './mailer-config.interface';

@Module({
  imports: [],
  providers: [MailerService, ConfigService],
  exports: [MailerService],
})
export class MailerModule {
  // public static forRoot(options?: MailerModuleOptions): DynamicModule {
  //   return {
  //     module: MailerModule,
  //     imports: [
  //       MailModule.forRoot({
  //         transport: {
  //           host: options?.host,
  //           port: options?.port,
  //           secure: true,
  //           auth: {
  //             user: options?.user,
  //             pass: options?.pass,
  //           },
  //           tls: {
  //             ciphers: 'SSLv3',
  //             rejectUnauthorized: false,
  //           },
  //           socketTimeout: 120000,
  //         },
  //         defaults: {
  //           from: `ZAIN ERENT <${options?.user}>`, // outgoing email ID
  //         },
  //         template: {
  //           dir: process.cwd() + '/template/',
  //           adapter: new HandlebarsAdapter(), // or new PugAdapter()
  //           options: {
  //             strict: true,
  //           },
  //         },
  //       }),
  //     ],
  //   };
  // }

  // public static forRootAsync(
  //   options?: MailerModuleAsyncOptions,
  // ): DynamicModule {
  //   return {
  //     module: MailerModule,
  // imports: [
  //   MailModule.forRootAsync({
  //     transport: {
  //       host: options?.host,
  //       port: options?.port,
  //       secure: true,
  //       auth: {
  //         user: options?.user,
  //         pass: options?.pass,
  //       },
  //       tls: {
  //         ciphers: 'SSLv3',
  //         rejectUnauthorized: false,
  //       },
  //       socketTimeout: 120000,
  //     },
  //     defaults: {
  //       from: `ZAIN ERENT <${options?.user}>`, // outgoing email ID
  //     },
  //     template: {
  //       dir: process.cwd() + '/template/',
  //       adapter: new HandlebarsAdapter(), // or new PugAdapter()
  //       options: {
  //         strict: true,
  //       },
  //     },
  //   }),
  // ],
  // providers: [this.createConnectProviders(options)],
  // };
  // }

  // private static createConnectProviders(
  //   options: MailerModuleAsyncOptions,
  // ): Provider {
  //   return {
  //     provide: 'MAILER_CONNECT_OPTIONS',
  //     useFactory: options.useFactory,
  //     inject: options.inject || [],
  //   };
  // }

  public static registerAsync(
    connectOptions: MailerModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: MailerModule,
      providers: this.createConnectProviders(connectOptions),
    };
  }

  private static createConnectProviders(
    options: MailerModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createConnectOptionsProvider(options)];
    }

    // for useClass
    return [
      this.createConnectOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createConnectOptionsProvider(
    options: MailerModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      // for useFactory
      return {
        provide: MAILER_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // For useExisting...
    return {
      provide: MAILER_OPTIONS,
      useFactory: async (optionsFactory: MailerOptionsFactory) =>
        await optionsFactory.createMailerConnectOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
