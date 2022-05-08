## Mailer
This is a small package that enables NestJS developers to have a local mail client via simple configurations

### Installation
```
npm i @afaqy/mailer
```
In your app module
```typescript
import { MailerModule } from '@afaqy/mailer';

imports: [
    MailerModule.forRoot({
        user: string, // email@example.com
        password: string, // your email's password
        host: string, // localhost
        port: number, // 565
    })
]
```

### Usage
```typescript
import { MailerService } from '@afaqy/mailer';

@Injectable()
export class appService {
    constructor(private mailer: MailerService) {}
  
    async forgetPassword(user) {
        const emailPayload = {
            receiver: user.email,
            subject: "Reset password link",
            body: "HTML_STRING",
            from: "YOUR_APP_NAME <YOUR_EMAIL>",
        };
        try {
            await this.mailer.sendEmail(emailPayload);
        } catch(e) {
            console.log(e);
        }
    }
}
```
