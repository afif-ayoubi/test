import { Controller, Post, Body, Get, Query, Param,Request } from '@nestjs/common';
import { FcmNotificationService } from './fcm-notification.service';
import { ExpressRequest } from 'src/users/middlewares/auth.middleware';

@Controller('firebase')
export class FcmNotificationController {
  constructor(private readonly fcmNotificationService: FcmNotificationService) {}

  @Post('send-notification')
  async sendNotification(@Body() bodyJoon: { title: string, body: string }) {
    const { title, body } = bodyJoon;
    return await this.fcmNotificationService.sendNotificationToAllUsers(title, body);
  }

  @Get(':userId')
  async getUserNotifications(@Request() request: ExpressRequest) {
    const result = await this.fcmNotificationService.getUserNotifications(request.user._id.toString());
    if (result.success) {
      return result.notifications;
    } else {
      return { error: result.message || result.error };
    }
  }
}


