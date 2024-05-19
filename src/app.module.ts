import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/users.module';
import { AuthMiddleware } from './users/middlewares/auth.middleware';
import { MailerModule } from '@nestjs-modules/mailer';
import 'dotenv/config';
import { ConfigModule } from '@nestjs/config';
import { OtpController } from './otp/otp.controllers';
import { OtpService } from './otp/otp.service';
import { MailModule } from './otp/otp.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.CONNECTION_STRING),
    UserModule,
    MailModule,
  ConfigModule.forRoot(
    {
      cache: true,
      isGlobal: true,
    }),

  
  ],
  controllers: [OtpController,],
  providers: [OtpService,],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude(
      { path: 'user/create', method: RequestMethod.POST },
      { path: 'user/login', method: RequestMethod.POST },
      { path: 'user/create-organization', method: RequestMethod.POST },
      { path: 'otp/verify', method: RequestMethod.POST},
      { path: 'otp/send', method: RequestMethod.POST},
      { path: 'user/change-password', method: RequestMethod.PATCH}
    )

      .forRoutes({
        path: '*',
        method: RequestMethod.ALL
      })
  }
}