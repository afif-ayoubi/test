import { PartialType } from '@nestjs/mapped-types';
import { CreateFcmNotificationDto } from './create-fcm-notification.dto';

export class UpdateFcmNotificationDto extends PartialType(CreateFcmNotificationDto) {}
