
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import 'dotenv/config';

import { ConfigService } from '@nestjs/config';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controllers';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: process.env.SMTP_HOST,
  
          secure: true,
          port: 465,
          auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD
          },
        },
      }),
    }),
    UserModule, 
  ],
  providers: [OtpService],
  controllers: [OtpController],
})
export class MailModule {}
