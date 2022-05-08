export interface SmtpMailInterface {
  receiver: string;
  from?: string;
  subject: string;
  body: string;
}
