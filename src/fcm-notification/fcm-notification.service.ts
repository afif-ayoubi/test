import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import 'dotenv/config';
import { User } from 'src/schemas/user.schema';
import { Notifications } from 'src/schemas/notification.schema';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),

  }),
});

@Injectable()
export class FcmNotificationService {
  constructor(
    @InjectModel(Notifications.name) private notificationModel: Model<Notifications>,
    @InjectModel(User.name) private userModel: Model<User>
  ) { }
  async sendNotificationToAllUsers(title: string, body: string) {
    const payload = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        name: "Joe",
        age: "21"
      }
    };
  
    try {
      const users = await this.userModel.find().select('notifications.fcm_token');
      const tokens = users.flatMap(user => user.notifications.map(notification => notification.fcm_token));
      const uniqueTokens = [...new Set(tokens)];
      
      const response = await admin.messaging().sendToDevice(uniqueTokens, payload);
  
      const notifications = uniqueTokens.map(token => ({
        fcm_token: token,
        title: title,
        body: body,
        sent_at: new Date().toISOString(),
        created_by: 'system'
      }));
  
      await Promise.all(users.map(async user => {
        const userTokens = user.notifications.map(notification => notification.fcm_token);
        const userNotificationTokens = userTokens.filter(token => uniqueTokens.includes(token));
  
        if (userNotificationTokens.length > 0) {
          await this.userModel.updateOne(
            { _id: user._id },
            {
              $push: {
                notifications: {
                  $each: notifications.filter(notification => userNotificationTokens.includes(notification.fcm_token))
                }
              }
            }
          );
        }
      }));
  
      return { success: true, response, notifications };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  
  async getUserNotifications(userId: string) {
    try {
      const user = await this.userModel.findById(userId).select('notifications');
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }
  
      return { success: true, notifications: user.notifications };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  

}
