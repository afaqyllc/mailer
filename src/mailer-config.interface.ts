import { ModuleMetadata } from '@nestjs/common';

export interface MailerOptionsFactory {
  createMailerConnectOptions(): Promise<MailerModuleOptions>;
}

export const MAILER_OPTIONS = 'MAILER_OPTIONS';

export interface MailerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useFactory?: (
    ...args: any[]
  ) => Promise<MailerModuleOptions> | MailerModuleOptions;
  inject?: any[];
  useExisting?: any;
  useClass?: any;
}

export interface MailerModuleOptions {
  host: string;
  port: number;
  user: string;
  pass: string;
}
