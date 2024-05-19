import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';


@Schema()
export class Notifications {
    @Prop({ required: true })
    fcm_token: string;

    @Prop()
    title: string;


    @Prop()
    body: string;


    @Prop({ default: new Date().toISOString() })
    sent_at: string;

    @Prop({ default: 'system' })
    created_by: string;

}
export const NotificationSchema = SchemaFactory.createForClass(Notifications);